import $host from "./index";

export const createOneProject = async (request) => {
    const {data} = await $host.post('projects/', request)
    return data
}

export const fetchProjects = async () => {
    const {data} = await $host.get('projects')
    return data
}

export const fetchProject = async (id) => {
    const {data} = await $host.get('projects/' + id)
    return data
}
export const fetchMyProjects = async () => {
    const {data} = await $host.get('projects/myProjects')
    return data
}

export const fetchOneProject = async (id) => {
    const {data} = await $host.get('projects/' + id)
    return data
}

export const fetchOneMyProject = async (id) => {
    const {data} = await $host.get('projects/myProject/' + id)
    return data
}

export const updateProject = async (projectUpd) => {
    const {data} = await $host.put('projects/' + projectUpd.id, projectUpd.requestData)
    return data
}

export const deleteOneProject = async (id) => {
    const {data} = await $host.delete('projects/' + id)
    return data
}

export const fetchPayedStages = async () => {
    const {data} = await $host.get('stages')
    return data
}

export const createOneStage = async (stage) => {
    const {data} = await $host.post('stages/', stage)
    return data
}

export const createCostStage = async (newStagePayment) => {
    try {
        console.log('Creating cost stage with data:', newStagePayment);
        
        // First update the stage with the cost
        const {data} = await $host.put('stages/' + newStagePayment.stageId, {cost: newStagePayment.cost});
        console.log('Stage updated with cost, response:', data);
        
        // Wait a moment to ensure the cost is updated in the database
        console.log('Waiting for database update...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Then create a payment for the stage
        console.log('Creating payment for stage:', newStagePayment.stageId);
        const paymentResponse = await $host.post('stages/' + newStagePayment.stageId + '/payments');
        console.log('Payment created, response:', paymentResponse.data);
        
        return {
            ...data,
            paymentLink: paymentResponse.data?.paymentLink
        };
    } catch (error) {
        console.error('Error in createCostStage:', error);
        console.error('Error details:', error.response?.data);
        throw error;
    }
}

export const createPaymentStage = async (stageId) => {
    try {
        const {data} = await $host.post('stages/' + stageId + '/payments');
        if (!data || !data.paymentLink) {
            throw new Error('Не удалось получить ссылку на оплату');
        }
        return data.paymentLink;
    } catch (error) {
        console.error('Error in createPaymentStage:', error);
        throw error;
    }
}

export const createOneTask = async (task) => {
    const {data} = await $host.post('tasks/', task)
    return data
}

export const fetchTask = async (id) => {
    const {data} = await $host.get(`tasks/${id}`)
    return data
}

export const updateTask = async (id, updateTaskArgs) => {
    console.log(updateTaskArgs)
    const {data} = await $host.put('tasks/' + id, updateTaskArgs)
    return data
}

export const completeOneTask = async (check) => {
    const {data} = await $host.put('tasks/' + check.taskId, {complete: check.complete})
    return data
}

export const deleteOneTask = async (taskId) => {
    const {data} = await $host.delete('tasks/' + taskId)
    return data
}

export const fetchTasksStage = async (id) => {
    const {data} = await $host.get('stages/' + id)
    return data.tasks
}

export const fetchMyTasksStage = async (id) => {
    const {data} = await $host.get('stages/myStages/' + id)
    return data.tasks
}

