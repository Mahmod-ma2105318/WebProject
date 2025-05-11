'use client';
import { addOrEditCourseAction } from '@/app/actions/server-actions';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import AdminNavBar from '@/app/components/AdminNavBar';

export default function AddOrEditCourse() {
    const searchParams = useSearchParams();
    const course = Object.fromEntries(searchParams);

    const [sections, setSections] = useState(() => {
        if (course.sections) {
            try {
                return JSON.parse(course.sections);
            } catch (e) {
                console.error('Failed to parse sections:', e);
                return [];
            }
        }
        return [];
    });

    const [instructors, setInstructors] = useState([]); // Simulate or fetch instructor list

    useEffect(() => {
        // Fetch instructors from your API or mock them
        setInstructors([
            { id: '1', name: 'Alice Johnson' },
            { id: '2', name: 'Bob Smith' },
        ]);
    }, []);

    const addSection = () => {
        console.log("Adding new section...");
        setSections(prev => [
            ...prev,
            {
                sectionNo: '',
                instructorId: '',
                maxSeats: '',
                enrolledStudents: 0,
                status: 'Open',
                validation: 'pending',
            },
        ]);
    };


    const deleteSection = (index) => {
        setSections(prev => prev.filter((_, i) => i !== index));
    };

    const updateSection = (index, field, value) => {
        const updated = [...sections];
        updated[index][field] = value;
        setSections(updated);
    };

    return (
        <>
            <div className="container">
                <h3>{course.id ? 'Edit Course' : 'Add Course'}</h3>
                <form action={addOrEditCourseAction}>
                    <input type="hidden" name="courseId" value={course.id || ''} />
                    <input type="hidden" name="sections" value={JSON.stringify(sections)} />

                    <div className="form-group">
                        <label>Course Name</label>
                        <input name="name" required defaultValue={course.name || ''} />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <input name="category" required defaultValue={course.category || ''} />
                    </div>

                    <div className="form-group">
                        <label>Credits</label>
                        <input type="number" name="credits" required defaultValue={course.credits || ''} />
                    </div>


                    <div className="form-group">
                        <label>Prerequisites (comma-separated course IDs)</label>
                        <input
                            name="prerequisites"
                            type="text"

                            title="Enter comma-separated numeric course IDs"
                            defaultValue={course.prerequisites || ''}
                        />
                    </div>

                    <div className="sections">
                        <h4>Sections</h4>

                        {sections.length === 0 && (
                            <p>No sections added yet. Click "Add Section" to create one.</p>
                        )}

                        {sections.map((section, index) => (
                            <div key={index} className="section" style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
                                <input
                                    placeholder="Section Number"
                                    value={section.sectionNo}
                                    onChange={(e) => updateSection(index, 'sectionNo', e.target.value)}
                                />
                                <select
                                    value={section.instructorId}
                                    onChange={(e) => updateSection(index, 'instructorId', e.target.value)}
                                >
                                    <option value="">Select Instructor</option>
                                    {instructors.map((instructor) => (
                                        <option key={instructor.id} value={instructor.id}>
                                            {instructor.name}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    placeholder="Max Seats"
                                    value={section.maxSeats}
                                    onChange={(e) => updateSection(index, 'maxSeats', e.target.value)}
                                />
                                <button type="button" onClick={() => deleteSection(index)}>🗑 Delete</button>
                            </div>
                        ))}

                        <button type="button" onClick={addSection} style={{ marginTop: 10 }}>➕ Add Section</button>
                    </div>


                    <button type="submit">{course.id ? 'Update Course' : 'Add Course'}</button>
                </form>
            </div>
        </>
    );
}
