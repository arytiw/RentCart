import ClientOnly from "@/app/components/ClientOnly";
import ReviewSection from "@/app/components/ReviewSection";
import Container from "@/app/components/Container";

const TestReviewsPage = () => {
  return (
    <ClientOnly>
      <Container>
        <div className="max-w-screen-lg mx-auto pt-10">
          <h1 className="text-3xl font-bold mb-8">Review System Test</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Item: VistaPhillips123</h2>
              <ReviewSection 
                itemId="VistaPhillips123"
                currentUser={null}
              />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Item: Mixer123</h2>
              <ReviewSection 
                itemId="Mixer123"
                currentUser={null}
              />
            </div>
          </div>
        </div>
      </Container>
    </ClientOnly>
  );
};

export default TestReviewsPage; 