import {
    getTotalStudentsPerCourseCategory,
    getTotalStudentsPerCourse,
    getTopMostTakenCourses,
    getFailedStudentsPerCourse,
    getFailureRatePerCategory,
    getTotalEnrollments,
    getAverageCourseCompletionRate,
    getStudentsNeverFailed,
    getMostFailedCourse,
    getHighestSuccessRateCourse
} from '@/app/repo/lib'
import InstructorNavBar from '@/app/components/InstructorNavBar';

export default async function StatsPage() {
    const [
        perCategory,
        perCourse,
        topCourses,
        failsPerCourse,
        failRateCategory,
        totalEnrollments,
        avgCompletionRate,
        neverFailed,
        mostFailed,
        bestSuccess
    ] = await Promise.all([
        getTotalStudentsPerCourseCategory(),
        getTotalStudentsPerCourse(),
        getTopMostTakenCourses(),
        getFailedStudentsPerCourse(),
        getFailureRatePerCategory(),
        getTotalEnrollments(),
        getAverageCourseCompletionRate(),
        getStudentsNeverFailed(),
        getMostFailedCourse(),
        getHighestSuccessRateCourse()
    ]);

    return (
        <div className="main-layout">
            <InstructorNavBar />
            <div className="container">
                <div className="stats-container" style={{ padding: '2rem' }}>
                    <h1>?? Course Statistics</h1>

                    <h2>1. Total Students per Course Category</h2>
                    <ul>{perCategory.map(c => <li key={c.category}>{c.category}: {c.count}</li>)}</ul>

                    <h2>2. Total Students per Course</h2>
                    <ul>
                        {perCourse
                            .filter(c => c.count > 0)
                            .map(c => (
                                <li key={c.course}>
                                    <strong>{c.course}</strong>: {c.count}
                                </li>
                            ))}

                    </ul>


                    <h2>3. Top 3 Most Taken Courses</h2>
                    <ol>{topCourses.map(c => <li key={c.course}>{c.course}: {c.count}</li>)}</ol>

                    <h2>4. Failed Students per Course</h2>
                    <ul>{failsPerCourse.map(c => <li key={c.course}>{c.course}: {c.failedCount} failed</li>)}</ul>

                    <h2>5. Failure Rate per Category</h2>
                    <ul>{failRateCategory.map(c => <li key={c.category}>{c.category}: {(c.failureRate * 100).toFixed(2)}%</li>)}</ul>

                    <h2>6. Total Enrollments</h2>
                    <p>{totalEnrollments}</p>

                    <h2>7. Average Completion Rate</h2>
                    <p>{(avgCompletionRate * 100).toFixed(2)}%</p>

                    <h2>8. Students Who Never Failed</h2>
                    <p>{neverFailed}</p>

                    <h2>9. Most Failed Course</h2>
                    {mostFailed ? (
                        <p>{mostFailed.course}: {mostFailed.failedCount} fails</p>
                    ) : (
                        <p>No failed courses recorded.</p>
                    )}


                    <h2>10. Highest Success Rate Course</h2>
                    {bestSuccess ? (
                        <p>{bestSuccess.name}: {(bestSuccess.successRate * 100).toFixed(2)}%</p>
                    ) : (
                        <p>No success data available.</p>
                    )}

                </div>

            </div>

        </div>
    );
}