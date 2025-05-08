import $host from './index';

export default class QualityService {
    static async getServiceMetrics(dateRange) {
        if (dateRange) {
            const startDate = dateRange[0].format('YYYY-MM-DD');
            const endDate = dateRange[1].format('YYYY-MM-DD');
            const { data } = await $host.get(`service-metrics/date-range?startDate=${startDate}&endDate=${endDate}`);
            return data;
        } else {
            const { data } = await $host.get('service-metrics');
            return data;
        }
    }

    static async getLatestServiceMetrics() {
        const { data } = await $host.get('service-metrics/latest');
        return data;
    }

    static async getServiceMetricsSummary() {
        const { data } = await $host.get('service-metrics/summary');
        return data;
    }

    static async getIncidents(dateRange) {
        if (dateRange) {
            const startDate = dateRange[0].format('YYYY-MM-DD');
            const endDate = dateRange[1].format('YYYY-MM-DD');
            const { data } = await $host.get(`incidents/date-range?startDate=${startDate}&endDate=${endDate}`);
            return data;
        } else {
            const { data } = await $host.get('incidents');
            return data;
        }
    }

    static async getIncidentStats() {
        const { data } = await $host.get('incidents/stats');
        return data;
    }

    static async getAuditLogs(dateRange) {
        if (dateRange) {
            const startDate = dateRange[0].format('YYYY-MM-DD');
            const endDate = dateRange[1].format('YYYY-MM-DD');
            const { data } = await $host.get(`audit-logs/date-range?startDate=${startDate}&endDate=${endDate}`);
            return data;
        } else {
            const { data } = await $host.get('audit-logs');
            return data;
        }
    }

    static async getAuditStats() {
        const { data } = await $host.get('audit-logs/stats');
        return data;
    }

    static async getQualityMetrics(category, dateRange) {
        if (category) {
            const { data } = await $host.get(`quality-metrics/category/${category}`);
            return data;
        } else if (dateRange) {
            const startDate = dateRange[0].format('YYYY-MM-DD');
            const endDate = dateRange[1].format('YYYY-MM-DD');
            const { data } = await $host.get(`quality-metrics/date-range?startDate=${startDate}&endDate=${endDate}`);
            return data;
        } else {
            const { data } = await $host.get('quality-metrics');
            return data;
        }
    }

    static async getServerMetrics(dateRange) {
        if (dateRange) {
            const startDate = dateRange[0].format('YYYY-MM-DD');
            const endDate = dateRange[1].format('YYYY-MM-DD');
            const { data } = await $host.get(`server-metrics/date-range?startDate=${startDate}&endDate=${endDate}`);
            return data;
        } else {
            const { data } = await $host.get('server-metrics');
            return data;
        }
    }

    static async seedQualityData() {
        const { data } = await $host.post('quality-seed');
        return data;
    }

    static async createIncident(incidentData) {
        // Ensure required fields are never null
        const sanitizedData = {
            ...incidentData,
            title: incidentData.title || 'Без заголовка',
            description: incidentData.description || 'Без описания',
            severity: incidentData.severity || 'medium',
            userId: incidentData.userId || 1,
            registrationTime: incidentData.registrationTime || new Date(),
            status: incidentData.status || 'open'
        };
        
        // If metadata is provided as an object, stringify it
        if (sanitizedData.metadata && typeof sanitizedData.metadata === 'object') {
            sanitizedData.metadata = JSON.stringify(sanitizedData.metadata);
        }
        
        // If we have relatedEntityType and relatedEntityId but no metadata, create it
        if (!sanitizedData.metadata && incidentData.relatedEntityType && incidentData.relatedEntityId) {
            sanitizedData.metadata = JSON.stringify({
                relatedEntityType: incidentData.relatedEntityType,
                relatedEntityId: incidentData.relatedEntityId,
                requestTitle: incidentData.requestTitle || '',
                additionalInfo: incidentData.additionalInfo || ''
            });
        }
        
        const { data } = await $host.post('incidents', sanitizedData);
        return data;
    }

    static async updateIncident(id, incidentData) {
        // Ensure required fields are never null
        const sanitizedData = {
            ...incidentData
        };
        
        if (incidentData.title === null || incidentData.title === undefined) {
            delete sanitizedData.title;
        }
        
        if (incidentData.description === null || incidentData.description === undefined) {
            delete sanitizedData.description;
        }
        
        const { data } = await $host.put(`incidents/${id}`, sanitizedData);
        return data;
    }
} 