import {SetMetadata} from "@nestjs/common";

export const EMPLOYEES_KEY = 'employees';

export const Employees = (...employees: string[]) => SetMetadata(EMPLOYEES_KEY, employees);
