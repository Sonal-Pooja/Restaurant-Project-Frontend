import React from 'react';
import classes from './Checkout.module.css';
import { useRef , useState , useContext} from 'react';
import mealContext from '../../store/MealItemContext';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Stack from '@mui/material/Stack';

const Checkout = (props) => {

  const ctx = useContext(mealContext)
   
   const [formValidity,setFormValidity] = useState({
    houseNo:true,
    street:true,
    postal:true,
    city:true
   })

   const [orderDone,setOrderDone] = useState(false)
   const [successMessage,setSuccessMessage] = useState(null)

    const houseNoRef = useRef()
    const streetRef = useRef()
    const postalRef = useRef()
    const cityRef = useRef()

    const isEmpty = value => value.trim() === ''
    const isSixChars = value => value.trim().length === 6


  const confirmHandler = (event) => {
    setOrderDone(false)
    setSuccessMessage(null)
    event.preventDefault();
    const enteredhouseNo = houseNoRef.current.value
    const enteredStreet = streetRef.current.value
    const enteredPostal = postalRef.current.value
    const enteredCity = cityRef.current.value

    const ishouseNoValid = !isEmpty(enteredhouseNo)
    const isEnteredStreetValid = !isEmpty(enteredStreet)
    const isEnteredPostalValid = isSixChars(enteredPostal)
    const isEnteredCityValid = !isEmpty(enteredCity)

    setFormValidity({
        houseNo : ishouseNoValid,
        street : isEnteredStreetValid,
        postal : isEnteredPostalValid,
        city : isEnteredCityValid
    })

    const isFormValid = ishouseNoValid && isEnteredStreetValid && isEnteredPostalValid && isEnteredCityValid

    if(isFormValid){
        submitOrder(enteredCity,enteredStreet,enteredPostal,enteredhouseNo)
        ctx.clearCart()
       // props.onCancel()
        return;
    }

  };


  async function submitOrder(enteredCity,enteredStreet,enteredPostal,enteredhouseNo){

    const response = await fetch('http://localhost:8080/web/getToken',{
      method:'POST',
      headers :{
          "Content-type":"application/json",
          'Access-Control-Allow-Origin':'*',
          "Accept": 'application/json',
      },
      body:JSON.stringify({"clientId":"frontend"})
  })

    const data = await response.json()
    console.log(data.accessToken)

    const body = {
      customerId : "12345",
      address : {
        city:enteredCity,
        street:enteredStreet,
        postalCode:enteredPostal,
        houseNo:enteredhouseNo
      },
      totalAmount : ctx.totalAmount,
      isCompleted : true,
      order : ctx.cartItems
    }


  const submitResponse = await fetch('http://localhost:8080/order',{
    method:'POST',
    body:JSON.stringify(body),
    headers:{
      "Content-type":"application/json",
      'Access-Control-Allow-Origin':'*',
      "Accept": 'application/json',
      "Authorization" : data.accessToken
  }
  })

  const submitResult = await submitResponse.json()

  console.log(submitResult)

  if(submitResult.status==="SUCCESS"){
      setOrderDone(true)
      setSuccessMessage(submitResult.message)
  }


  }

  const onBeforeInputHandler = (event) => {
      const key = event.target.id
      let newFormState = {...formValidity}
      if(key in formValidity){
           newFormState[key] = true
      }
      setFormValidity(newFormState)
  }

  return (
    <React.Fragment>
    {!orderDone && <form className={classes.form} onSubmit={confirmHandler}>
      <div className={`${classes.control} ${formValidity.houseNo ? '' : classes.invalid}`}>
        <label htmlFor='houseNo'>Your House Number</label>
        <input type='text' id='houseNo' ref={houseNoRef} onBeforeInput={onBeforeInputHandler} />
        {!formValidity.houseNo && <p>Please enter a valid house number!</p>}
      </div>
      <div className={`${classes.control} ${formValidity.street ? '' : classes.invalid}`}>
        <label htmlFor='street'>Street</label>
        <input type='text' id='street' ref={streetRef} onBeforeInput={onBeforeInputHandler}/>
        {!formValidity.street && <p>Please enter a valid street!</p>}
      </div>
      <div className={`${classes.control} ${formValidity.postal ? '' : classes.invalid}`}>
        <label htmlFor='postal'>Postal Code</label>
        <input type='text' id='postal' ref={postalRef} onBeforeInput={onBeforeInputHandler} />
        {!formValidity.postal && <p>Please enter a valid postal of length 6!</p>}
      </div>
      <div className={`${classes.control} ${formValidity.city ? '' : classes.invalid}`}>
        <label htmlFor='city'>City</label>
        <input type='text' id='city' ref={cityRef} onBeforeInput={onBeforeInputHandler}/>
        {!formValidity.city && <p>Please enter a valid city!</p>}
      </div>
      <div className={classes.actions}>
        <button type='button' onClick={props.onCancel}>
          Cancel
        </button>
        <button className={classes.submit}>Confirm</button>
      </div>
    </form>}
    {orderDone &&  <Stack sx={{ width: '100%' }} spacing={2}>
                                      <Alert severity="success">
                                          <AlertTitle>Success</AlertTitle>
                                          This is a success alert — <strong>{successMessage}</strong>
                                        </Alert>
                                        <div className={classes.actions}>
                                                  <button type='button' onClick={props.onCancel}>
                                                    Wuhoo
                                                  </button>
     
                                        </div>  
                         </Stack>
                        
    }
    </React.Fragment>
  );
};

export default Checkout;