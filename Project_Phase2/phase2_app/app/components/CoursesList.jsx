'use client';
export default function CoursesList({ courses }) {

  return (
    <>
 
      <main>


        <div className="search-container">
          <input type="text" id="searchInput" placeholder="Search courses..." />

          <select id="filterType">
            <option value="all">All</option>
            <option value="name">By Name</option>
            <option value="category">By Category</option>
          </select>
        </div>

      </main>
    </>

  );
}

//<button className="register-btn" onClick={() => registerCourse(course.name, sec.sectionNo)}