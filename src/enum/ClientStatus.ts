import { ClientStatus } from "@/model/Client";


export const statusList :  ClientStatus[] = [
    {
        statusId : 1 ,
        key : "PENDING",
        value : "Pending"
    },
    {
        statusId : 2,
        key : "IN_PROGRESS",
        value : "In Progress"
    },
    {
        statusId : 3,
        key : "DONE",
        value : "Done"
    }
];