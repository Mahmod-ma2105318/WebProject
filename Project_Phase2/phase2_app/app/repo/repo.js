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

  async getLoggedInUser() {
    const user = await prisma.user.findFirst({
      where: {
        isLoggedIn: true,
      }
    });
    return user;
  }
  async logIn(user) {
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
  async getCourses() {
    return await prisma.course.findMany(
      {
        include: {
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
              // mode: 'insensitive' // optional: case-insensitive search
            }
          },
          {
            category: {
              startsWith: search,
              // mode: 'insensitive'
            }
          }
        ],
        // include: {
        //   prerequisites: true,
        //   sections: true
        // }
      }
    });
  }
  async searchForCoursesByName(search) {
    return await prisma.course.findMany({
      where: {
        name: {
          startsWith: search,
          // mode: 'insensitive'
        }
      },
      include: {
        sections: true
      }
    });
  }
  async searchForCoursesByCategory(search) {
    return await prisma.course.findMany({
      where: {
        category: {
          startsWith: search,
          // mode: 'insensitive'
        }
      },
      include: {
        sections: true
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



  async registerForCourse({ sectionId }) {
    const user = await this.getLoggedInUser();
    if (!user) throw new Error("No user is logged in");
  
    const student = await this.connectUserToStudent(user);
    if (!student) throw new Error("Student not found for user");
  
    // ✅ Get section with course (including scalar prerequisites) and enrollment
    const section = await prisma.section.findUnique({
      where: { id: sectionId },
      include: {
        course: true,         // Includes scalar fields like prerequisites
        Enrollment: true
      }
    });
  
    if (!section) return;
  
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
  
    // 5. Check prerequisites (from course.prerequisites JSON)
    const prereqs = course.prerequisites || [];
  
    if (
      Array.isArray(prereqs) &&
      prereqs.length > 0 &&
      !(prereqs.length === 1 && prereqs[0].name === "None")
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
  
      const completedCourseNames = completedCourses.map(
        e => e.section.course.name
      );
  
      const missingPrereqs = prereqs.filter(
        prereq => !completedCourseNames.includes(prereq.name)
      );
  
      if (missingPrereqs.length > 0) {
        throw new Error(`Missing prerequisites: ${missingPrereqs.map(p => p.name).join(", ")}`);
      }
    }
  
    // 6. All checks passed → create enrollment
    return await prisma.enrollment.create({
      data: {
        validation: 'PENDING',
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
        validation: 'PENDING',
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


  // Administrator
  async getOpenCourses() {
    return await prisma.course.findMany({
      include: {

        sections: {
          where: {
            status: 'Open' // ✅ status must be a string
          }
        }
      }
    });
  }

  async getPendingCourses() {
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
  async approveRegReq(userId, sectionId) {
    const student = await prisma.student.findUnique({
      where: { userId }
    });

    if (!student) throw new Error('Student not found');

    return await prisma.enrollment.update({
      where: {
        sectionId_studentId: {
          sectionId,
          studentId: userId,
        }
      },
      data: {
        validation: 'APPROVE'
      }
    });
  }

  async declineRegReq(userId, sectionId) {
    const student = await prisma.student.findUnique({
      where: { userId }
    });

    if (!student) throw new Error('Student not found');

    return await prisma.enrollment.delete({
      where: {
        sectionId_studentId: {
          sectionId,
          studentId: student.id
        }
      }
    });
  }
  async validateSection(sectionId) {
    return await prisma.section.update({
      where: { id: sectionId },
      data: {
        validation: 'approved'
      },
      include: {
        course: {
          include: {

          }
        }
      }
    });
  }
  async invalidateSection(sectionID) {
    // First delete enrollments referencing the section
    await prisma.enrollment.deleteMany({
      where: { sectionId: sectionID }
    });

    // Then delete the section itself
    return await prisma.section.delete({
      where: { id: sectionID }
    });
  }


  async addCourse(courseData) {
    return await prisma.course.create({
      data: {
        name: courseData.name,
        category: courseData.category,
        credits: courseData.credits,
        prerequisites: courseData.prerequisites, // this is now a JSON array
        sections: {
          create: courseData.sections.map(section => ({
            sectionNo: section.sectionNo,
            instructorId: parseInt(section.instructorId),
            maxSeats: parseInt(section.maxSeats),
            enrolledStudents: section.enrolledStudents,
            status: section.status,
            validation: section.validation
          }))
        }
      }
    });
  }




  //Instructor

  async getEnrollmentsForInstructor(userId) {
    return await prisma.enrollment.findMany({
      where: {
        status: 'CURRENT',
        grade: null,
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
        status:'FINISHED',
        grade
      }
    });
  }
}

export default new repo();