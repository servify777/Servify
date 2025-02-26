
const About = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 text-gray-800 mt-6">
      <h1 className="text-3xl font-bold text-center mb-6">About Servify</h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Why Servify?</h2>
        <p>
          In today&apos;s fast-paced world, finding the right professional for your needs can be challenging. Servify is designed to bridge the gap between clients and talented professionals through a structured and transparent bidding platform.
        </p>
        <ul className="list-disc pl-5 mt-2">
          <li>Clients get the best value for their money by choosing from multiple bids.</li>
          <li>Freelancers get fair opportunities to showcase their skills.</li>
          <li>Projects are completed efficiently with structured communication.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">How Servify Works?</h2>
        <div className="space-y-4">
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-medium">🔍 Step 1: Post a Project</h3>
            <p>Clients describe their requirements, set a budget, and post a project.</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-medium">💼 Step 2: Receive Bids from Experts</h3>
            <p>Freelancers browse projects and place competitive bids.</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-medium">🤝 Step 3: Choose the Best Offer</h3>
            <p>Clients review bids, compare expertise, and select the best professional.</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-medium">⚡ Step 4: Get the Job Done</h3>
            <p>Once a bid is accepted, work begins, ensuring timely project completion.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
