import Header from '../crossSections/header';
import Footer from '../crossSections/Footer'
import SearchBar from './search';
import SlideShow from './slideshow';

const Home = () => {
    return (
        <>
            <Header />
            <section className="w-5/6 justify-center mx-auto">
                <div className="bg-(--color-primary) py-4 ">
                    <SearchBar />
                </div>
                <SlideShow />
            </section>


            <Footer />
        </>
    );
};

export default Home;

//a5844d