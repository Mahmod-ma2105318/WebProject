import path from 'path';
import fs from 'fs-extra';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const studentsPath = path.join(process.cwd(), 'app/data/students.json');
const coursesPath = path.join(process.cwd(), 'app/data/courses.json');
const usersPath = path.join(process.cwd(), 'app/data/users.json');

async function seed() {
    console.log('Seeding......');

    try {
        const studentsData = JSON.parse(await fs.readFile(studentsPath, 'utf-8'));
        const coursesData = JSON.parse(await fs.readFile(coursesPath, 'utf-8'));
        const usersData = JSON.parse(await fs.readFile(usersPath, 'utf-8'));

        const usersArray = usersData.users || [];

        for (const user of usersArray) {
            await prisma.user.upsert({
                where: { username: user.username },
                update: {},
                create: {
                    username: user.username,
                    password: user.pass,
                    role: user.role.toUpperCase(),
                    ...(user.role === 'student' && { student: { create: {} } }),
                    ...(user.role === 'instructor' && { instructor: { create: {} } }),
                    ...(user.role === 'administrator' && { admin: { create: {} } })
                },
            });
        }

        for (const course of coursesData.CoursesForRegistration) {
            await prisma.course.upsert({
                where: { name: course.name },
                update: {},
                create: {
                    name: course.name,
                    category: course.category,
                    credits: course.credits
                }
            });
        }

        for (const course of coursesData.CoursesForRegistration) {
            for (const section of course.section) {
                let instructorConnect = {};

                if (section.instructor) {
                    const instructorUser = await prisma.user.findUnique({
                      where: { username: section.instructor }
                    });
                  
                    if (instructorUser) {
                      const instructor = await prisma.instructor.findUnique({
                        where: { userId: instructorUser.id }
                      });
                  
                      if (instructor) {
                        instructorConnect = {
                          connect: { id: instructor.id }
                        };
                      }
                    }
                }
                  

                await prisma.section.create({
                    data: {
                        sectionNo: section.sectionNo,
                        status: section.status,
                        maxSeats: section.maxSeats,
                        enrolledStudents: section.enrolledStudents,
                        validation: section.validation,
                        course: { connect: { name: course.name } },
                        ...(Object.keys(instructorConnect).length > 0 && { instructor: instructorConnect })
                    }
                });
            }
        }

        for (const course of coursesData.CoursesForRegistration) {
            if (course.prerequisites && course.prerequisites.length > 0) {
                for (const prereq of course.prerequisites) {
                    if (prereq !== "None") {
                        try {
                            const mainCourse = await prisma.course.findUnique({
                                where: { name: course.name }
                              });
                              
                              const prereqCourse = await prisma.course.findUnique({
                                where: { name: prereq }
                              });
                              
                              if (mainCourse && prereqCourse) {
                                await prisma.coursePrerequisite.create({
                                  data: {
                                    courseId: mainCourse.id,
                                    prerequisiteId: prereqCourse.id
                                  }
                                });
                              } else {
                                console.warn(`Missing course(s): ${course.name} or ${prereq}`);
                              }
                              
                        } catch (error) {
                            console.error(`Error creating prerequisite ${prereq} for ${course.name}:`, error.message);
                        }
                    }
                }
            }
        }

        for (const student of studentsData.students) {
            const user = await prisma.user.findUnique({
                where: { username: student.user[0].username }
            });

            if (!user) {
                console.warn(`User not found for student: ${student.user[0].username}`);
                continue;
            }

            for (const finishedCourse of student.finishedCourses) {
                try {
                    const section = await prisma.section.findFirst({
                        where: {
                            course: { name: finishedCourse.courseName }
                        }
                    });

                    if (section) {
                        await prisma.enrollment.create({
                            data: {
                                student: { connect: { userId: user.id } },
                                section: { connect: { id: section.id } },
                                status: 'FINISHED',
                                grade: finishedCourse.Grade
                            }
                        });
                    }
                } catch (error) {
                    console.error(`Error creating finished course for ${user.username}:`, error.message);
                }
            }

            for (const currentCourse of student.CurrentCourses) {
                try {
                    const section = await prisma.section.findFirst({
                        where: {
                            course: { name: currentCourse.name }
                        }
                    });

                    if (section) {
                        await prisma.enrollment.create({
                            data: {
                                student: { connect: { userId: user.id } },
                                section: { connect: { id: section.id } },
                                status: 'CURRENT'
                            }
                        });
                    }
                } catch (error) {
                    console.error(`Error creating current course for ${user.username}:`, error.message);
                }
            }

            for (const registeredCourse of student.RegisteredCourses || []) {
                try {
                    const section = await prisma.section.findFirst({
                        where: {
                            course: { name: registeredCourse.name }
                        }
                    });

                    if (section) {
                        await prisma.enrollment.create({
                            data: {
                                student: { connect: { userId: user.id } },
                                section: { connect: { id: section.id } },
                                status: 'REGISTERED'
                            }
                        });
                    }
                } catch (error) {
                    console.error(`Error creating registered course for ${user.username}:`, error.message);
                }
            }
        }

        console.log('Seeding finished successfully.');
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
