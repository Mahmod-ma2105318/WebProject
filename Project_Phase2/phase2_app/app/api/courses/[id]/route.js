export async function GET(req) {
    const response = { message: 'API endpoint GET http://localhost:3000/api' }
    return Response.json(response, { status: 200 })
}

export async function POST(req) {
    const response = { message: 'API endpoint GET http://localhost:3000/api' }
    return Response.json(response, { status: 200 })
}

export async function PUT(req) {
    const response = { message: 'Put' }
    return Response.json(response, { status: 200 })
}

export async function DELETE(req) {
    const response = { message: 'Delete' }
    return Response.json(response, { status: 200 })
}


