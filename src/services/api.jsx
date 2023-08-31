import axios from 'axios';
import Cookies from 'js-cookie';

const baseUrl = import.meta.env.VITE_SERVERURL
// const baseUrl = 'http://localhost:5000'

const getClientListApi = async (details) => {
  const response = await axios.post(`${baseUrl}/getClientList`, details)

  if (response.status == 200) 
    return response
  else if (response.status == 204) 
    return alert("You are now Inactive Please contact your")
  
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

const updateCreditApi = async (  details) => {
  const cookieValue = Cookies.get('userToken');

  const response = await axios.post(`${baseUrl}/updateClientCredits`, {...details,cookie:cookieValue})
  if (response.status == 201) {   
    alert(response.data.error)
  }
  else if (response.status == 200) {
    alert(`Client credits updated successfully`)
    return response
  }
}

const activeStatusApi = async ( details) => {
  const cookieValue = Cookies.get('userToken');

  const response = await axios.post(`${baseUrl}/updateClientActivity`, {...details,cookie:cookieValue})
  if (response.status == 201) {   
    alert(response.data.error)
  }
  else if (response.status == 200) {
    alert(`Client activity updated successfully`)
    return response
  }
}

const updatePasswordApi = async ( details) => {
  const cookieValue = Cookies.get('userToken');

  const response = await axios.post(`${baseUrl}/updateClientPassword`, {...details,cookie:cookieValue})
  if (response.status == 201) {   
    alert(response.data.error)
  }
  else if (response.status == 200) {
    alert(`Client Password updated successfully`)
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
const getTransactionsOnBasisOfPeriodApi = async(details)=>{
  const cookieValue = Cookies.get('userToken');
  const response = await axios.post(`${baseUrl}/getTransanctionOnBasisOfDatePeriod`, {...details,cookie:cookieValue});
    return response
}


export {baseUrl, getClientListApi,getTransactionsOnBasisOfPeriodApi,activeStatusApi,getRealTimeCreditsApi,updatePasswordApi, addClientApi, updateCreditApi, deleteClientApi,transactionsApi }
