import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class repo {

    async getCourses() {
        return await prisma.course.findMany(
            {
                include: {
                    prerequisites: true,
                    sections: true,
                }
            }
        )
    }

}

export default new repo();