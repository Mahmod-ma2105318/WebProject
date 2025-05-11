import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
const prisma = new PrismaClient();

class repo {
  //User Repo
  async getUser(username, pass) {
    const user = await prisma.user.findFirst({
      where: {
        username,
        password: pass,
      },
    });
    return user;
  }
  
  async getLoggedInUser(){
    const user = await prisma.user.findFirst({
      where: {
        isLoggedIn:true,
      }
    });
    return user;
  }
  async  logIn(user) {
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isLoggedIn: true,
      },
    });
  
    return updatedUser;
  }
  async logOut(user) {
    const updatedUser = await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        isLoggedIn: false,
      },
    });
  
    return updatedUser;
  }
  
  
  //Student Repo Methods
  async connectUserToStudent(user) {
    return await prisma.student.findUnique({
      where: {
        userId: user.id  // Make sure user.id is provided
      },
      include: {
        enrollments: {
          include: {
            section: {
              include: {
                course: true  // This gives you access to the Course details
              }
            }
          }
        }
      }
    });
  }
  async showInstructorBySectionId(sectionId) {
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      include: {
        instructor: {
          include: {
            user: true // includes the instructor's user info (like username)
          }
        }
      }
    });
  
    if (!section || !section.instructor || !section.instructor.user) {
      return null;
    }
  
    return section.instructor.user.username; // or return section.instructor.user for full info
  }
  async getCourses() {
    return await prisma.course.findMany(
      {
        include: {
          prerequisites: true,
          sections: true,
        }
      }
    )
  }
  async searchForCourses(search) {
    return await prisma.course.findMany({
      where: {
        OR: [
          {
            name: {
              startsWith: search,
              mode: 'insensitive' // optional: case-insensitive search
            }
          },
          {
            category: {
              startsWith: search,
              mode: 'insensitive'
            }
          }
        ],
        include: {
          prerequisites: true,
          sections: true
        }
      }
    });
  }
  async searchForCoursesByName(search) {
    return await prisma.course.findMany({
      where: {
        name: {
          startsWith: search,
          mode: 'insensitive'
        }
      },
      include: {
        prerequisites: true,
        sections: true
      }
    });
  }
  async searchForCoursesByCategory(search) {
    return await prisma.course.findMany({
      where: {
        category: {
          startsWith: search,
          mode: 'insensitive'
        }
      },
      include: {
        prerequisites: true,
        sections: true
      }
    });
  }
  
  

  async registerForCourse({ sectionId }) {
    const user = await this.getLoggedInUser();
    if (!user) throw new Error("No user is logged in");
  
    const student = await this.connectUserToStudent(user);
    if (!student) throw new Error("Student not found for user");
  
    // Get section with its course and prerequisites
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      include: {
        course: {
          include: {
            prerequisites: true
          }
        },
        Enrollment: true
      }
    });
  
    if (!section) {
      throw new Error("Section not found")
    }
  
    const course = section.course;
  
    // 1. Check if section is open
    if (section.status !== "Open") {
      throw new Error(`Section ${section.sectionNo} is not open for registration.`);
    }
  
    // 2. Check seat capacity
    const enrolledCount = await prisma.enrollment.count({
      where: {
        sectionId: sectionId,
        status: "REGISTERED"
      }
    });
  
    if (enrolledCount >= section.maxSeats) {
      throw new Error(`Section ${section.sectionNo} is full.`);
    }
  
    // 3. Check if already finished the course
    const hasFinished = await prisma.enrollment.findFirst({
      where: {
        studentId: student.id,
        section: {
          courseId: course.id
        },
        status: "FINISHED"
      }
    });
  
    if (hasFinished) {
      throw new Error(`You already finished the course ${course.name}.`);
    }
  
    // 4. Check if currently registered for the course
    const isCurrentlyRegistered = await prisma.enrollment.findFirst({
      where: {
        studentId: student.id,
        section: {
          courseId: course.id
        },
        status: "REGISTERED"
      }
    });
  
    if (isCurrentlyRegistered) {
      throw new Error(`You are already registered for ${course.name}.`);
    }
  
    // 5. Check prerequisites
    if (
      course.prerequisites.length > 0 &&
      !(course.prerequisites.length === 1 && course.prerequisites[0].name === "None")
    ) {
      const completedCourses = await prisma.enrollment.findMany({
        where: {
          studentId: student.id,
          status: "FINISHED"
        },
        include: {
          section: {
            include: {
              course: true
            }
          }
        }
      });
      const completedCourseNames = completedCourses.map(e => e.section.course.name);
  
      const missingPrereqs = course.prerequisites.filter(
        prereq => !completedCourseNames.includes(prereq.name)
      );
  
      if (missingPrereqs.length > 0) {
        throw new Error(`Missing prerequisites: ${missingPrereqs.map(p => p.name).join(", ")}`);
      }
    }
  
    // 6. All checks passed → create enrollment
    return await prisma.enrollment.create({
      data: {
        validation:"PENDING",
        student: { connect: { id: student.id } },
        section: { connect: { id: sectionId } },
        status: "REGISTERED"
      }
    });
  }
  
  
  
  
  
  async showRegisteredCourses({ studentId }) {
    return await prisma.enrollment.findMany({
      where: {
        status: 'REGISTERED',
        studentId
      },
      include: {
        section: {
          include: {
            course: true
          }
        }
      }
    });
  }
  async showCurrentCourses({ studentId }) {
    return await prisma.enrollment.findMany({
      where: {
        status: 'CURRENT',
        studentId
      },
      include: {
        section: {
          include: {
            course: true
          }
        }
      }
    });
  }
  async showFinishedCourses({ studentId }) {
    return await prisma.enrollment.findMany({
      where: {
        status: 'FINISHED',
        studentId
      },
      include: {
        section: {
          include: {
            course: true
          }
        }
      }
    });
  }
  async showRegisteredCourses({ studentId }) {
    return await prisma.enrollment.findMany({
      where: {
        status: 'REGISTERED',
        studentId
      },
      include: {
        section: {
          include: {
            course: true
          }
        }
      }
    });
  }


  // Administrator
  async getOpenCourses() {
    return await prisma.course.findMany({
      include: {
        prerequisites: true,
        sections: {
          where: {
            status: 'Open' // ✅ status must be a string
          }
        }
      }
    });
  }
  async  getPendingCourses() {
    return await prisma.enrollment.findMany({
      where: {
          validation: 'PENDING'
      },
      include: {
        section: {
          include: {
            course: true,
            instructor: {
              include: {
                user: true
              }
            }
          }
        },
        student: {
          include: {
            user: true
          }
        }
      }
    });
  }
  
  
  async getCurrentlyTakenCourses() {
      return await prisma.enrollment.findMany({
        where: {
          status: 'CURRENT',
        },
        include: {
          section: {
            include: {
              course: true
            }
          }
        }
      });
  }
  async getCoursesWithPendingSections() {
    const courses = await prisma.course.findMany({
      where: {
        status: 'REGISTERED',
        sections: {
          some: {
            status: 'Open',
            validation: 'pending'
          }
        }
      },
      include: {
        prerequisites: true, // ✅ include course prerequisites
        sections: {
          where: {
            status: 'Open',
            validation: 'pending'
          },
          include: {
            instructor: {
              include: {
                user: true // ✅ get instructor username, email, etc.
              }
            }
          }
        }
      }
    });
  
    return courses;
  }
  
  
  
  
  
  async validateSection(sectionId) {
    return await prisma.section.update({
      where: { id: sectionId },
      data: {
        validation: 'Valid'
      },
      include: {
        course: {
          include: {
            prerequisites: true
          }
        }
      }
    });
  }

  //Instructor

  async  getEnrollmentsForInstructor(userId) {
    return await prisma.enrollment.findMany({
      where: {
        status: 'CURRENT',
        grade:null,
        section: {
          instructor: {
            userId: userId
          }
        }
      },
      include: {
        student: {
          include: {
            user: true
          }
        },
        section: {
          include: {
            course: true,
            instructor: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });
  }

  async gradeStudent(sectionId, userId, grade) {
    return await prisma.enrollment.update({
      where: {
        sectionId_studentId: {
          sectionId,
          studentId: userId  // ✅ if studentId === userId
        }
      },
      data: {
        grade
      }
    });
  }
  
  
  
  


}

export default new repo();