import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// 1. Total students per course category
export async function getTotalStudentsPerCourseCategory() {
  const enrollments = await prisma.enrollment.findMany({
    select: { section: { select: { course: { select: { category: true } } } } }
  });

  const counts = {};
  for (const enr of enrollments) {
    const cat = enr.section.course.category;
    counts[cat] = (counts[cat] || 0) + 1;
  }

  const allCourses = await prisma.course.findMany({ select: { category: true } });
  for (const course of allCourses) {
    if (!counts[course.category]) counts[course.category] = 0;
  }

  return Object.entries(counts).map(([category, count]) => ({ category, count }));
}

// 2. Total students per course
export async function getTotalStudentsPerCourse() {
    const enrollments = await prisma.enrollment.findMany({
      select: {
        section: {
          select: {
            course: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
  
    const counts = {};
  
    for (const enr of enrollments) {
      const course = enr.section.course;
      if (!counts[course.id]) {
        counts[course.id] = { course: course.name, count: 0 };
      }
      counts[course.id].count++;
    }
  
    // Optionally include courses with zero enrollments
    const allCourses = await prisma.course.findMany({ select: { id: true, name: true } });
    for (const course of allCourses) {
      if (!counts[course.id]) {
        counts[course.id] = { course: course.name, count: 0 };
      }
    }
  
    return Object.values(counts);
}
  

// 3. Top 3 most taken courses
export async function getTopMostTakenCourses() {
  const data = await getTotalStudentsPerCourse();
  return data.sort((a, b) => b.count - a.count).slice(0, 3);
}

// 4. Total failed students per course
export async function getFailedStudentsPerCourse() {
    const failedEnrollments = await prisma.enrollment.findMany({
      where: { grade: 'F' },
      select: {
        section: {
          select: {
            course: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
  
    const failCounts = {};
  
    for (const enr of failedEnrollments) {
      const course = enr.section.course;
      if (!failCounts[course.id]) {
        failCounts[course.id] = { course: course.name, failedCount: 0 };
      }
      failCounts[course.id].failedCount++;
    }
  
    const allCourses = await prisma.course.findMany({
      select: { id: true, name: true }
    });
  
    for (const course of allCourses) {
      if (!failCounts[course.id]) {
        failCounts[course.id] = { course: course.name, failedCount: 0 };
      }
    }
  
    return Object.values(failCounts);
}
  

// 5. Failure rate per category
export async function getFailureRatePerCategory() {
  const enrollments = await prisma.enrollment.findMany({
    where: { grade: { not: null } },
    select: { grade: true, section: { select: { course: { select: { category: true } } } } }
  });

  const stats = {};
  for (const enr of enrollments) {
    const cat = enr.section.course.category;
    if (!stats[cat]) stats[cat] = { fail: 0, total: 0 };
    if (enr.grade === 'F') stats[cat].fail++;
    stats[cat].total++;
  }

  return Object.entries(stats).map(([category, { fail, total }]) => ({
    category,
    failureRate: total > 0 ? fail / total : 0
  }));
}

// 6. Total enrollments
export async function getTotalEnrollments() {
  return await prisma.enrollment.count();
}

// 7. Average course completion rate
export async function getAverageCourseCompletionRate() {
  const enrollments = await prisma.enrollment.findMany({
    select: { grade: true, section: { select: { courseId: true } } }
  });

  const stats = {};
  for (const enr of enrollments) {
    const id = enr.section.courseId;
    if (!stats[id]) stats[id] = { completed: 0, total: 0 };
    if (enr.grade !== null) stats[id].completed++;
    stats[id].total++;
  }

  const rates = Object.values(stats).map(s => s.completed / s.total);
  const avg = rates.reduce((a, b) => a + b, 0) / rates.length || 0;
  return avg;
}

// 8. Students who never failed
export async function getStudentsNeverFailed() {
    return prisma.student.count({
      where: {
        enrollments: {
          none: {
            grade: 'F'
          }
        }
      }
    });
}
  

// 9. Most failed course
export async function getMostFailedCourse() {
    const fails = await getFailedStudentsPerCourse();
    if (!fails || fails.length === 0) return null;
  
    const sorted = fails.sort((a, b) => b.failedCount - a.failedCount);
    const top = sorted[0];
  
    if (!top || typeof top.failedCount !== 'number') return null;
    return top;
  }
  

// 10. Course with highest success rate
export async function getHighestSuccessRateCourse() {
  const enrollments = await prisma.enrollment.findMany({
    where: { grade: { not: null } },
    select: { grade: true, section: { select: { courseId: true, course: { select: { name: true } } } } }
  });

  const stats = {};
  for (const enr of enrollments) {
    const id = enr.section.courseId;
    const name = enr.section.course.name;
    if (!stats[id]) stats[id] = { name, success: 0, fail: 0 };
    if (enr.grade === 'F') stats[id].fail++;
    else stats[id].success++;
  }

  let best = null;
  let highest = 0;
  for (const { name, success, fail } of Object.values(stats)) {
    const total = success + fail;
    const rate = total > 0 ? success / total : 0;
    if (rate > highest) {
      highest = rate;
      best = { name, successRate: rate };
    }
  }

  return best;
}