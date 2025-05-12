'use client';

import React, { useState } from 'react';
import { approveRegReq, declineRegReq } from '@/app/actions/server-actions';

export default function PendingCourseActions({ initialCourses }) {
  const [courses, setCourses] = useState(initialCourses);

  const handleApprove = async (userId, sectionId) => {
    await approveRegReq(userId, sectionId);
    alert('Approved');
    setCourses(prev => prev.filter(e => !(e.student.userId === userId && e.sectionId === sectionId)));
  };

  const handleDecline = async (userId, sectionId) => {
    await declineRegReq(userId, sectionId);
    alert('Declined');
    setCourses(prev => prev.filter(e => !(e.student.userId === userId && e.sectionId === sectionId)));
  };

  return (
    <>
      {courses.map((enrollment, index) => (
        <div key={index} className="course-card">
          <div className="student-info">Student: {enrollment.student.user.username}</div>
          <div className="course-name">{enrollment.section.course.name}</div>
          <div className="course-category">Category: {enrollment.section.course.category}</div>
          <div className="course-credits">Credits: {enrollment.section.course.credits}</div>
          <div className="course-instructor">
            Instructor: {enrollment.section.instructor?.user.username || 'TBD'}
          </div>
          <div className="course-status">Status: {enrollment.validation || 'PENDING'}</div>

          <div id="validationCard">
            <button onClick={() => handleApprove(enrollment.student.userId, enrollment.sectionId)}>
              Approve
            </button>
            <button onClick={() => handleDecline(enrollment.student.userId, enrollment.sectionId)}>
              Decline
            </button>
          </div>
        </div>
      ))}
    </>
  );
}