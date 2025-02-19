// import Header from '../crossSections/header';
// import Footer from '../crossSections/Footer'
import SearchBar from './search';
//import SlideShow from './slideshow';
import Category from './categorias';
import ProductCards from './productCards';

const Home = () => {
    return (
        <>
            {/* <Header /> */}
            <main className="w-5/6 justify-center mx-auto">
                <div className="bg-(--color-primary) py-4 mb-4">
                    <SearchBar />
                </div>
                <div className="py-4 mb-4">
                    <Category />
                </div>
                
                <div className="py-4 mb-4 flex flex-col">
                    <h1 className="text-2xl font-bold text-(--color-secondary) mb-8">Recomendaciones</h1>
                    <ProductCards />
                </div>
            </main>
            {/* <Footer /> */}
        </>
    );
};

export default Home;

//a5844d