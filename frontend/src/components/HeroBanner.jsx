import { Carousel, Container } from 'react-bootstrap';

function HeroBanner() {
  return (
    <div className="bg-light py-3">
      <Container>
        <Carousel fade>
          {["/images/baner1.jpg", "/images/banner2.jpg", "/images/banner3.jpg"].map((src, idx) => (
            <Carousel.Item key={idx}>
              <img
                className="d-block w-100 rounded"
                src={src}
                alt={`Slide ${idx + 1}`}
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    </div>
  );
}

export default HeroBanner;