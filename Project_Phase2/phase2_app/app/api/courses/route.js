import repo from '@/app/repo/repo.js';

export async function GET(req) {
    const courses = await repo.getCourses();
    return Response.json(courses, { status: 200 })
}

export async function POST(req, { params }) {
    const response = { message: 'API endpoint POST http://localhost:3000/api' }
    return Response.json(response, { status: 201 })
}


