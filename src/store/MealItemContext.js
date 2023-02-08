import React , {useReducer} from "react";

const mealContext = React.createContext({
    cartItems:[],
    totalAmount:0,
    addItem:(item)=>{},
    removeItem:(id)=>{},
    clearCart:()=>{}   
})


export default mealContext

const maintainCart  = (cart,action) => {
          return {cartItems : action.cartItems , totalAmount : action.totalAmount}
}

export function MealContextProvider(props){
      
   const[selectedItems,setSelectedItems] = useReducer(maintainCart,{cartItems : [] , totalAmount:0})

    console.log("cartItems : " + JSON.stringify(selectedItems.cartItems) + " total Amount : " + JSON.stringify(selectedItems.totalAmount))

    const addItem = (item) => {
    
    console.log(item)
    let newState = [...selectedItems.cartItems]
    let found=false 
    let price=0;
            
    for(let i=0 ; i<newState.length; i++){
            if(item.id === newState[i].id){
                        newState[i].amount = item.amount
                        found = true;
            }
    price += parseFloat(newState[i].price) * parseInt(newState[i].amount)        
                
    } // for ends......

    if(!found){
    newState.unshift(item)
    price += parseFloat(item.price) * parseInt(item.amount)  
    }  
         
    setSelectedItems({cartItems : newState , totalAmount : price.toFixed(2)})
        
    }// addItem ends...



    const removeItem = (id) => {
          
        const newState = []
        let price=0;

        for(let i=0 ; i<selectedItems.cartItems.length ; i++){

               if(id===selectedItems.cartItems[i].id){
                    if(parseInt(selectedItems.cartItems[i].amount) > 1){
                        let item = {
                            id : selectedItems.cartItems[i].id,
                            name : selectedItems.cartItems[i].name,
                            description : selectedItems.cartItems[i].description,
                            price : selectedItems.cartItems[i].price,
                            amount : parseInt(selectedItems.cartItems[i].amount) -1
                        }
                        price += parseFloat(item.price) * parseInt((item.amount))
                        newState.push(item) 
                    }
               }else{
                 newState.push(selectedItems.cartItems[i])
                 price += parseFloat(selectedItems.cartItems[i].price) * parseInt((selectedItems.cartItems[i].amount))
               }

        }// for ends......

        setSelectedItems({cartItems : newState , totalAmount : price.toFixed(2)})
    }
    
    const clearCart = () => {
        setSelectedItems({cartItems : [] , totalAmount : 0})
    }


    return (
        <mealContext.Provider value={{
            cartItems : selectedItems.cartItems,
            totalAmount:selectedItems.totalAmount,
            addItem:addItem,
            removeItem:removeItem,
            clearCart:clearCart
            }}>
                   
            {props.children}

        </mealContext.Provider>
    )

}