import axiosInstance from "../axiosInstance"

export const testAPI = () : Promise<string> => {
    return axiosInstance.get('https://jsonplaceholder.typicode.com/todos/1');
}