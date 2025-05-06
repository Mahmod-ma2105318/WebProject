import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient()

class JobsRepo{

    async getJobs(status) {
        if (status) {
            return await prisma.job.findMany({
                where: { status: status },
                include: { applications: true }
            })
        }
        else {
            return await prisma.job.findMany({
                include: { applications: true }
            })
        }
    }
    async getJob(id) {
        return await prisma.job.findUnique({
            where: { id: id },
            include: { applications: true }

        })
    }

    async addJob(newJob) {
        return await prisma.job.create({ data: newJob })

    }
    async deleteJob(id) {
        return await prisma.job.delete({
            where: { id: id }
        })

    }
    async updateJob(jobId,status) {
        return await prisma.room.update({
            where: {
                id: jobId
            },
            data: {
                isActive: status,
            }
        })
    }

    
}
export default new JobsRepo();