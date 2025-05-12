const path = require('path');
const fs = require('fs-extra');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const studentsPath = path.join(process.cwd(), 'app/data/students.json');
const coursesPath = path.join(process.cwd(), 'app/data/courses.json');
const usersPath = path.join(process.cwd(), 'app/data/users.json');

async function seed() {
  console.log('Seeding...');

  try {
    const studentsData = JSON.parse(await fs.readFile(studentsPath, 'utf-8'));
    const coursesData = JSON.parse(await fs.readFile(coursesPath, 'utf-8'));
    const usersData = JSON.parse(await fs.readFile(usersPath, 'utf-8'));

    const usersArray = usersData.users || [];

    // 1. Users
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
          ...(user.role === 'administrator' && { admin: { create: {} } }),
        },
      });
    }

    // 2. Courses (Update this part for prerequisites as JSON array)
    for (const course of coursesData) {
      const prerequisites = course.prerequisites && course.prerequisites.length > 0
        ? course.prerequisites.map(p => p.trim())
        : [];

      await prisma.course.upsert({
        where: { name: course.name },
        update: {
          category: course.category,
          credits: course.credits,
          prerequisites: prerequisites.length > 0 ? prerequisites : null, // Store as JSON array
        },
        create: {
          name: course.name,
          category: course.category,
          credits: course.credits,
          prerequisites: prerequisites.length > 0 ? prerequisites : null, // Store as JSON array
        },
      });
    }

    // 3. Sections
    for (const course of coursesData) {
      for (const section of course.section) {
        let instructorConnect = {};
        if (section.instructor) {
          const instructorUser = await prisma.user.findUnique({
            where: { username: section.instructor },
          });

          if (instructorUser) {
            const instructor = await prisma.instructor.findUnique({
              where: { userId: instructorUser.id },
            });

            if (instructor) {
              instructorConnect = {
                connect: { id: instructor.id },
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
            ...(Object.keys(instructorConnect).length > 0 && {
              instructor: instructorConnect,
            }),
          },
        });
      }
    }

    // 4. Enrollments
    const enrollCourses = async (user, courseList, status) => {
      for (const course of courseList) {
        const courseName = course.name || course.courseName;

        const section = await prisma.section.findFirst({
          where: {
            course: { name: courseName },
          },
        });

        if (section) {
          await prisma.enrollment.create({
            data: {
              student: { connect: { userId: user.id } },
              section: { connect: { id: section.id } },
              status,
              ...(status === 'FINISHED' && course.Grade
                ? { grade: course.Grade }
                : {}),
            },
          });
        }
      }
    };

    for (const student of studentsData.students) {
      const username = student.user[0].username;
      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user) {
        console.warn(`User not found for student: ${username}`);
        continue;
      }

      await enrollCourses(user, student.finishedCourses || [], 'FINISHED');
      await enrollCourses(user, student.CurrentCourses || [], 'CURRENT');
      await enrollCourses(user, student.RegisteredCourses || [], 'REGISTERED');
    }

    console.log('Seeding completed!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();

