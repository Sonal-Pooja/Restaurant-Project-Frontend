import {Fragment} from "react";
import mealsImage from '../../assests/meals.jpg'
import classes from './Header.module.css'
import HeaderCartButton from "./HeaderCartButton";

const Header = props => {
   
    const clickHandler = () => props.showCart()
    
   return (
    <Fragment>
        <header className={classes.header}>
            <h1>Ottomons</h1>
            <HeaderCartButton showCart={clickHandler} />
        </header>
             
        <div className={classes['main-image']}>
            <img src={mealsImage} alt="A table full of delicious food :)."/>
        </div>
    </Fragment>
   )
}

export default Header 