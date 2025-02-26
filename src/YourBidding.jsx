import React, { useEffect } from 'react'

const YourBidding = () => {

  return (
    <div>
      return (
      <div className="flex items-center justify-center  min-h-screen mt-32">
        <main className="transparent-card p-5 min-w-fit m-4">
            <h1 className="new-font text-4xl mb-4">Your Winnings :</h1>
            {Data && (
            Data.map((Data,index)=>{
                return (
                    <>
                    <hr />
                    <section className="flex space-x-6 m-4 min-w-fit">
                    <div>
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-300">
                            <img src={Data.url || "/default-avatar.png"} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
    <div>
      <h2 className="text-xl font-semibold" key={index}>{Data.title}</h2>
      <p className="text-gray-600" key={index}>{Data.client}</p>
      <h4 className="text-gray-700 mt-2" key={index}>
        Description: {Data.description}
      </h4>
      <hr />
    </div>
    <BidCard Data = {Data} budget={Data.budget}/>
  </section>
                    </>
                )
            })
          )}
        </main>
      </div>
    );
    </div>
  )
}

export default YourBidding
