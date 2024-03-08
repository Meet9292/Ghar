import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Contact({ listing }) {
  const [landlord, setLandLord] = useState(null);
  const [message, setMessage] = useState('');

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`/server/user/${listing.userRef}`);
        const data = await res.json();
        setLandLord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-4">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for{" "}
            <span className="font-semibold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name="message"
            id="message"
            value={message}
            placeholder="Enter your message here..."
            onChange={onChange}
            className="w-full border p-3 rounded-lg"
            rows="2"
          ></textarea>

          {/* {console.log(landlord.email)} */}

          <Link
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-90"
            to={`mailto:${landlord.email}?subject=Regarding${listing.name}
            &body=${message}`}
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}

export default Contact;
