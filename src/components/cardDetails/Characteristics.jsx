import { useInstrumentState } from '../../context/InstrumentContext';

const Characteristics = ({ specifications }) => {
    const { specifications: allSpecifications } = useInstrumentState();
    console.log(allSpecifications);
    console.log(specifications);
    const items = ["Marca", "Modelo", "Material", "Tipo", "Elemento"]
    return (
        <div className="grid md:grid-cols-2 gap-4">
            {specifications.map((spec, index) => {
                const specDetails = allSpecifications.find(s => s.id === spec.specification.id);
                console.log(specDetails);
                return (
                    <div key={index} className="flex items-center gap-2 bg-(--color-light) p-3 rounded-md">
                        <i className={`fas ${specDetails?.icon} text-(--color-secondary)`}></i>
                        <p className="text-(--color-secondary) text-sm"><strong>{specDetails?.label}:</strong> {spec.spValue}</p>
                    </div>
                );
            })}
        </div>
    )
}

export default Characteristics