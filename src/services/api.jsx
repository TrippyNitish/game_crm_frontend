import axios from 'axios';
import Cookies from 'js-cookie';

// const baseUrl = 'https://crmserver-8jed.onrender.com'
const baseUrl = 'http://localhost:5000'


const getClientListApi = async (details) => {
  const response = await axios.post(`${baseUrl}/getClientList`, details)

  if (response.status == 201) 
    alert(response.data.error)  
  else if (response.status == 200) 
    return response
  
}

const getRealTimeCreditsApi = async(details)=>{
  const response = await axios.post(`${baseUrl}/getRealTimeCredits`, details)
   return response
}

const addClientApi = async ( details) => {
  const cookieValue = Cookies.get('userToken');

  const response = await axios.post(`${baseUrl}/addClient`, {...details,cookie:cookieValue})
  if (response.status == 201) {
    alert(response.data.error)
  }
  else if (response.status == 200) {
    alert(`Client added successfully`)
    return response
  }
}

const updateClientApi = async (  details) => {
  const cookieValue = Cookies.get('userToken');

  const response = await axios.post(`${baseUrl}/updateClientDetails`, {...details,cookie:cookieValue})
  if (response.status == 201) {   
    alert(response.data.error)
  }
  else if (response.status == 200) {
    alert(`Client updated successfully`)
    return response
  }
}


const deleteClientApi = async (details) => {
  const cookieValue = Cookies.get('userToken');

  const response = await axios.post(`${baseUrl}/deleteClient`, {...details,cookie:cookieValue})
  
  if (response.status == 201) {
    alert(response.data.error)
  }
  else if (response.status == 200) {
    alert(`Client deleted successfully`)
    return response
  }
}


const transactionsApi = async(details)=>{
  const cookieValue = Cookies.get('userToken');

  const response = await axios.post(`${baseUrl}/transactions`, {...details,cookie:cookieValue});
    return response
  
}

export {baseUrl, getClientListApi,getRealTimeCreditsApi, addClientApi, updateClientApi, deleteClientApi,transactionsApi }
