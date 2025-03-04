import { localDB } from '../../database/LocalDB';

const Characteristics = ({specifications }) => {

    const items = ["Marca", "Modelo", "Material", "Tipo", "Elemento"]
    return (
        <div className="grid md:grid-cols-2 gap-4">
            {specifications.map((spec, index) => {
                const specDetails = localDB.getSpecificationById(spec.specification.id);
                return (
                    <div key={index} className="flex items-center gap-2 bg-(--color-light) p-3 rounded-md">
                        <i className={`fas ${specDetails?.icon} text-(--color-secondary)`}></i>
                        <p className="text-(--color-secondary) text-sm"><strong>{specDetails?.name}:</strong> {spec.spValue}</p>
                    </div>
                );
            })}
        </div>
    )
}

export default Characteristics