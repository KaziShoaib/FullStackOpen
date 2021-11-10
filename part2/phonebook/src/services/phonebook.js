import axios from "axios"

const baseURL = 'http://localhost:3001/persons'

const create = (newObject) => {
  const request = axios.post(baseURL, newObject)
  return request.then(response => response.data)
}

const getAll = () => {
  const request = axios.get(baseURL)
  return request.then(response => response.data)
}

const remove = (id) => {
  const request = axios.delete(`${baseURL}/${id}`)
  return request.then(response => response.data)
}

const update = (newObject) => {
  const request  = axios.put(`${baseURL}/${newObject.id}`, newObject)
  return request.then(response => response.data)
}

export default {create, getAll, remove, update}