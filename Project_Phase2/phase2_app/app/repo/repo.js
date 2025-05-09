import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class repo {
    async getUser(username, pass) {
        const user = await prisma.user.findUnique({
            where: {
                username: username,
                password: pass 
            }
        });
        return user;
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
                  contains: search,
                  mode: 'insensitive' // optional: case-insensitive search
                }
              },
              {
                category: {
                  contains: search,
                  mode: 'insensitive'
                }
              }
            ],
            include:{
                prerequisites: true,
                sections:true
            }
          }
        });
    }

    async registerForCourse({ studentId, sectionId }) {
        // Get section with its course and that course’s prerequisites
        const section = await prisma.section.findUnique({
          where: { id: sectionId },
          include: {
            course: {
              include: { prerequisites: true }
            },
            Enrollment: true
          }
        });
      
        if (!section) throw new Error("Section not found");
      
        const courseId = section.course.id;
        const prerequisites = section.course.prerequisites;
      
        // Get all finished course IDs for this student
        const finishedEnrollments = await prisma.enrollment.findMany({
          where: {
            studentId,
            status: 'FINISHED'
          },
          include: {
            section: {
              include: {
                course: true
              }
            }
          }
        });
      
        const finishedCourseIds = finishedEnrollments.map(e => e.section.course.id);
      
        // Check if student satisfies all prerequisites
        const missingPrereqs = prerequisites.filter(pr => !finishedCourseIds.includes(pr.prerequisiteId));
        if (missingPrereqs.length > 0) {
          throw new Error("Prerequisite courses not fulfilled");
        }
      
        // Check for available seats
        if (section.enrolledStudents >= section.maxSeats) {
          throw new Error("Section is full");
        }
      
        // Create the enrollment
        const enrollment = await prisma.enrollment.create({
          data: {
            studentId,
            sectionId,
            status: 'REGISTERED'
          }
        });
      
        // Increment the section's enrolledStudents count
        await prisma.section.update({
          where: { id: sectionId },
          data: {
            enrolledStudents: {
              increment: 1
            }
          }
        });
      
        return enrollment;
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
  async getPendingCourses() {
    return await prisma.course.findMany({
      include: {
        prerequisites: true,
        sections: {
          where: {
            validation: 'pending'
          }
        }
      }
    });
  }
  async getCurrentlyTakenCourses(){
    return await prisma.course.findMany({
      include:{
        prerequisites:true,
        

      }
    }) 
  }
  
  
    


      
      
      
      
      

}

export default new repo();