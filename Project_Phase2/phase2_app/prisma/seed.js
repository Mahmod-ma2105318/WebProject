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
        // Read and parse JSON files
        const studentsData = JSON.parse(await fs.readFile(studentsPath, 'utf-8'));
        const coursesData = JSON.parse(await fs.readFile(coursesPath, 'utf-8'));
        const usersData = JSON.parse(await fs.readFile(usersPath, 'utf-8'));

        // Extract users array from the nested structure
        const usersArray = usersData.users || [];

        // First, seed all users and their roles
        for (const user of usersArray) {
            await prisma.user.upsert({
                where: { username: user.username },
                update: {},
                create: {
                    username: user.username,
                    password: user.pass,
                    role: user.role.toUpperCase(),
                    ...(user.role === 'student' && {
                        student: { create: {} }
                    }),
                    ...(user.role === 'instructor' && {
                        instructor: { create: {} }
                    }),
                    ...(user.role === 'administrator' && {
                        admin: { create: {} }
                    })
                },
            });
        }

        // Seed Courses without sections first
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

        // Now seed sections with instructor connections
        for (const course of coursesData.CoursesForRegistration) {
            for (const section of course.section) {
                let instructorConnect = {};

                if (section.instructor) {
                    // Find the instructor's user record
                    const instructorUser = await prisma.user.findUnique({
                        where: { username: section.instructor }
                    });

                    if (instructorUser) {
                        // Find the instructor record linked to this user
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
                        course: {
                            connect: { name: course.name }
                        },
                        ...(Object.keys(instructorConnect).length > 0 && {
                            instructor: instructorConnect
                        })
                    }
                });
            }
        }

        // Handle prerequisites
        for (const course of coursesData.CoursesForRegistration) {
            if (course.prerequisites && course.prerequisites.length > 0) {
                for (const prereq of course.prerequisites) {
                    if (prereq !== "None") {
                        try {
                            await prisma.coursePrerequisite.create({
                                data: {
                                    course: { connect: { name: course.name } },
                                    prerequisite: { connect: { name: prereq } }
                                }
                            });
                        } catch (error) {
                            console.error(`Error creating prerequisite ${prereq} for ${course.name}:`, error.message);
                        }
                    }
                }
            }
        }

        // Seed Student Enrollments
        for (const student of studentsData.students) {
            const user = await prisma.user.findUnique({
                where: { username: student.user[0].username }
            });

            if (!user) {
                console.warn(`User not found for student: ${student.user[0].username}`);
                continue;
            }

            // Finished Courses
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

            // Current Courses
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

            // Registered Courses (if any)
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