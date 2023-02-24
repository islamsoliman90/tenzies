import { nanoid } from "nanoid";
import React from "react";
import Confetti from "react-confetti";
import Die from "./Die";


export default function App ()
{
    const [ dice, setDice ] = React.useState( allNewDice() );
    const [ tenzies, setTenzies ] = React.useState( false );
    const [ start, setStart ] = React.useState( false );
    const [ count, setCount ] = React.useState( 30 );
    const [ bestScore, setBestScore ] = React.useState( 0 );
    React.useEffect( () =>
    {
        if ( localStorage.getItem( "rollDice" ) )
        {
            setBestScore( () => localStorage.getItem( "rollDice" ) );
        } else
        {
            localStorage.setItem( "rollDice", 0 );
        }

    }, [] );

    function best ()
    {
        if ( Number( bestScore ) < count )
        {
            console.log( "here" );
            localStorage.setItem( 'rollDice', String( count ) );
        }
    }

    console.log( localStorage.getItem( "rollDice" ) );

    React.useEffect( () =>
    {

        // console.log("Dice state changed")
        const allHeld = dice.every( die => die.isHeld );
        const firstValue = dice[ 0 ].value;
        const allSameValue = dice.every( die => die.value === firstValue );

        if ( allHeld && allSameValue )
        {

            best();
            setTenzies( true );
            console.log( "You won!" );
        }
    }, [ dice ] );




    function generateNewDie ()
    {
        return {
            value: Math.ceil( Math.random() * 6 ),
            isHeld: false,
            id: nanoid()
        };
    }


    function allNewDice ()
    {
        const newDice = [];

        for ( let i = 0; i < 24; i++ )
        {

            newDice.push( generateNewDie() );
        }

        return newDice;
    }


    function rollDice ()
    {
        if ( !tenzies && count > 0 )
        {
            setStart( true );
            setDice( oldDice => oldDice.map( die =>
            {
                return die.isHeld ?
                    die :
                    generateNewDie();
            } ) );
            setCount( ( num ) => --num );
        } else
        {

            setTenzies( false );
            setDice( allNewDice );
            setStart( false );
            setCount( ( num ) => num = 30 );
            setBestScore( () => localStorage.getItem( "rollDice" ) );

        }
    }

    function holdDice ( id )
    {
        setDice( oldDice => oldDice.map( die =>
        {
            return die.id === id ?
                { ...die, isHeld: !die.isHeld } :
                die;
        } ) );
    }

    const diceElements = dice.map( die => (
        <Die
            key={ die.id }
            value={ die.value }
            isHeld={ die.isHeld }
            holdDice={ () => holdDice( die.id ) }
        />
    ) );
    console.log( bestScore );
    return (
        <main>
            { tenzies && <Confetti /> }
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                { diceElements }
            </div>
            <button
                className={ count === 0 ? "roll-dice hidden-btn" : "roll-dice" }
                onClick={ rollDice }
            >
                { tenzies ? "New Game" : count !== 0 ? "Roll" : "gameOver" }
            </button>
            { start && <h1>{ count }</h1> }
            <h2> { "Best Score " + bestScore }</h2>

        </main>
    );
}