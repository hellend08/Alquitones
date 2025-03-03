import React, { useEffect, useState } from 'react'
// import { localDB } from '../../database/LocalDB';

const Characteristics = () => {
    // const [specifications, setSpecifications] = useState([]);

    // useEffect(()=> {
    //     getSpecifications()
    // }, []) 

    // const getSpecifications = () => {
    //     const allSpacifications = localDB.getAllSpecifications();
    //     setSpecifications(allSpacifications);
    // }

    const items = ["Marca", "Modelo", "Material", "Tipo", "Elemento"]
    return (
        <div>
            
            <ul>
                {/* {specifications.map((item, index) =>  */}
                    <li>
                        {/* <i className={specification.icon}></i>{specification.name} */}
                    </li>
                {/* )} */}
            </ul>
        </div>
    )
}

export default Characteristics