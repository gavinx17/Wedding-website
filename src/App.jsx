import { useState } from "react";
import "./App.css";
import GrowingSunflower from "./GrowingSunflower";

function Vine({ flip = false, short = false }) {
  const w = short ? 160 : 340;
  return (
    <svg
      className={`vine${flip ? " vine--flip" : ""}`}
      viewBox={`0 0 ${w} 28`}
      width={w}
      height="28"
      aria-hidden="true"
    >
      <path
        d={`M2 14 C ${w * 0.25} -4, ${w * 0.5} 30, ${w * 0.75} 8 S ${w - 6} 20, ${w - 2} 14`}
        fill="none"
        stroke="var(--gold)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      {[0.18, 0.4, 0.62, 0.84].map((t, i) => (
        <path
          key={i}
          d={`M${w * t} ${14 + (i % 2 === 0 ? -3 : 3)} q 7 -9 13 -1`}
          fill="none"
          stroke="var(--gold)"
          strokeWidth="1.2"
          strokeLinecap="round"
          transform={i % 2 === 0 ? "" : `rotate(180 ${w * t} ${14 + 3})`}
        />
      ))}
    </svg>
  );
}

function SectionLabel({ children }) {
  return <p className="section-label">{children}</p>;
}

function Hero() {
  return (
    <header className="hero">
      <p className="hero-eyebrow">Together with their families</p>
      <h1 className="hero-names">
        Gavin <span className="hero-amp">&amp;</span> Chloe
      </h1>
      <Vine />
      <p className="hero-date">October 17, 2027 &nbsp;·&nbsp; Wimberly, Texas</p>
      <a className="hero-cta" href="#rsvp">Reserve your seat</a>
    </header>
  );
}

function OurStory() {
  return (
    <section className="story" id="story">
      <div className="story-art" aria-hidden="true">
        <div className="story-frame" />
      </div>
      <div className="story-copy">
        <SectionLabel>Our story</SectionLabel>
        <h2>Eight Years, one long conversation</h2>
        <p>
          
        </p>
        <p>
          
        </p>
      </div>
    </section>
  );
}

const DETAILS = [
  {
    title: "Ceremony",
    time: "4:00 PM",
    place: "The Lookout, The Videre Estate",
    note: "Seating begins at 3:30. Please arrive with time to spare — the lane in is gravel.",
  },
  {
    title: "Reception",
    time: "5:30 PM",
    place: "The Barn, Hollow Creek Vineyard",
    note: "Dinner, toasts, and dancing until 11. Cocktail hour on the terrace beforehand.",
  },
  {
    title: "Attire",
    time: "Garden formal",
    place: "Earth tones welcome",
    note: "Evenings run cool — a wrap or light jacket for outdoor moments is a good idea.",
  },
];

function Details() {
  return (
    <section className="details" id="details">
      <SectionLabel>The day</SectionLabel>
      <h2 className="details-heading">Where &amp; when</h2>
      <div className="detail-cards">
        {DETAILS.map((d) => (
          <div className="detail-card" key={d.title}>
            <p className="detail-time">{d.time}</p>
            <h3>{d.title}</h3>
            <p className="detail-place">{d.place}</p>
            <p className="detail-note">{d.note}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Travel() {
  return (
    <section className="travel" id="travel">
      <div className="travel-inner">
        <div>
          <SectionLabel>Getting there</SectionLabel>
          <h2>Travel &amp; stay</h2>
          <p>
            We will have limited spaces for on site lodging at
            the <a target="_blank" href="https://www.thevidereestate.co/accomodations">Videre Estate</a>. However,
            there are many other lodging options nearby, including the following:
            <ul>
              <li className="travel-link"><a target="_blank" href="https://hiddenfoxescape.com/">The Hidden Fox Escape</a></li>
            </ul>
          </p>
        </div>
        <div className="travel-meta">
          <div>
            <p className="detail-time">The Videre Estate Lodging</p>
            <p className="detail-note">Insert the link for the lodging here</p>
          </div>
          <div>
            <p className="detail-time">Room block closes</p>
            <p className="detail-note">August 1, 2027</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function RSVP() {
  const [form, setForm] = useState({
    name: "",
    attending: "joyfully-yes",
    guests: "1",
    meal: "no-preference",
    note: "",
  });
  const [submitted, setSubmitted] = useState(false);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // Wire this up to your form backend of choice (Formspree, Netlify
    // Forms, Google Sheets via Apps Script, etc). For now it just
    // confirms locally.
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <section className="rsvp" id="rsvp">
        <Vine short />
        <h2>Thank you, {form.name.split(" ")[0] || "friend"}.</h2>
        <p>Your response has been noted — we can't wait to celebrate with you.</p>
      </section>
    );
  }

  return (
    <section className="rsvp" id="rsvp">
      <Vine short />
      <SectionLabel>Kindly reply by August 1</SectionLabel>
      <h2>RSVP</h2>
      <form className="rsvp-form" onSubmit={handleSubmit}>
        <label>
          Full name
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Your name"
          />
        </label>

        <fieldset>
          <legend>Will you join us?</legend>
          <div className="radio-row">
            <label className="radio">
              <input
                type="radio"
                name="attending"
                checked={form.attending === "joyfully-yes"}
                onChange={() => update("attending", "joyfully-yes")}
              />
              Joyfully accepts
            </label>
            <label className="radio">
              <input
                type="radio"
                name="attending"
                checked={form.attending === "regretfully-no"}
                onChange={() => update("attending", "regretfully-no")}
              />
              Regretfully declines
            </label>
          </div>
        </fieldset>

        {form.attending === "joyfully-yes" && (
          <>
            <label>
              Number attending
              <select
                value={form.guests}
                onChange={(e) => update("guests", e.target.value)}
              >
                {["1", "2", "3", "4"].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
          </>
        )}

        <label>
          Note (optional)
          <textarea
            rows="3"
            value={form.note}
            onChange={(e) => update("note", e.target.value)}
            placeholder="Song requests, dietary notes, well wishes..."
          />
        </label>

        <button type="submit" className="rsvp-submit">Send response</button>
      </form>
    </section>
  );
}

function Registry() {
  return (
    <section className="registry" id="registry">
      <SectionLabel>Gifts</SectionLabel>
      <h2>Registry</h2>
      <p>
        Your presence is the gift — but for those who've asked, we've put
        together a small registry, and a honeymoon fund for the trip we keep
        postponing.
      </p>
      <a className="registry-link" href="#">View the registry</a>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <Vine short />
      <p>Gavin &amp; Chloe</p>
      <p className="footer-date">10 · 17 · 2027</p>
    </footer>
  );
}

export default function App() {
  return (
    <div className="page">
      <GrowingSunflower side="left" />
      <GrowingSunflower side="right" />
      <Hero />
      <OurStory />
      <Details />
      <Travel />
      <RSVP />
      <Registry />
      <Footer />
    </div>
  );
}
