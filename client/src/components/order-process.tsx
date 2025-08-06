export default function OrderProcess() {
  return (
    <section className="py-20 bg-forest-green text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">Simple Ordering Process</h2>
          <p className="text-xl text-green-100">Get your plants in just a few easy steps</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold">1</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Browse & Select</h3>
            <p className="text-green-100">Choose from our selection of premium cuttings and seedlings</p>
          </div>

          <div className="text-center">
            <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold">2</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Add to Cart</h3>
            <p className="text-green-100">Add your chosen plants to cart and review your order</p>
          </div>

          <div className="text-center">
            <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold">3</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Choose Safe Meeting</h3>
            <p className="text-green-100">Select any safe location for delivery or choose from our secure pickup hotspots</p>
          </div>

          <div className="text-center">
            <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl font-bold">4</span>
            </div>
            <h3 className="text-lg font-bold mb-2">Receive Plants</h3>
            <p className="text-green-100">Get your healthy plants delivered fresh and ready to grow</p>
          </div>
        </div>
      </div>
    </section>
  );
}
