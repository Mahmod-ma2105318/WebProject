import { PrismaClient } from "@prisma/client"
import fs from "fs-extra"
import path from "path"

const prisma = new PrismaClient()

async function seed() {
    console.log("Seeding Started.....");

    const jobs = await fs.readJSON(path.join(process.cwd(), 'app/data/jobs.json'))
    const applications = await fs.readJSON(path.join(process.cwd(), 'app/data/applications.json'))

    for (const job of jobs) {
        await prisma.job.create({ data: job })
    }
    for (const application of applications) {
        await prisma.application.create({ data: application })
    }

    prisma.$disconnect
    console.log('Completed Seeding');

}

seed()