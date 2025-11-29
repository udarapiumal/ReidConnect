import http from "k6/http";
import { check, sleep, group } from "k6";

// 👥 Configure virtual users and ramp-up stages
export let options = {
  stages: [
    { duration: "10s", target: 20 },  // ramp-up to 20 users
    { duration: "30s", target: 100 }, // hold 100 concurrent users
    { duration: "10s", target: 0 },   // ramp down
  ],
  thresholds: {
    http_req_failed: ["rate<0.02"],    // <2% error rate
    http_req_duration: ["p(95)<1500"], // 95% of requests < 1.5s
  },
};

// 🧩 Test data (replace with real or mock values)
const BASE_URL = "http://localhost:8080";
const TEST_USER_ID = 1; // or use dynamically assigned IDs later
const SAMPLE_EVENT_IDS = [1, 2, 3, 4, 5]; // replace with actual event IDs from your DB

export default function () {
  group("🏠 Load Dashboard Sequence", function () {
    // 1️⃣ Fetch all events
    let res1 = http.get(`${BASE_URL}/api/events`);
    check(res1, { "GET /api/events status 200": (r) => r.status === 200 });
    sleep(0.5);

    // 2️⃣ Fetch featured events
    let res2 = http.get(`${BASE_URL}/api/events/featured`);
    check(res2, { "GET /api/events/featured status 200": (r) => r.status === 200 });
    sleep(0.5);

    // 3️⃣ For each event, simulate user attendance queries
    for (let eventId of SAMPLE_EVENT_IDS) {
      let countsRes = http.get(`${BASE_URL}/api/events/${eventId}/attendance/counts`);
      check(countsRes, {
        [`GET /api/events/${eventId}/attendance/counts 200`]: (r) => r.status === 200,
      });
      sleep(0.2);

      let userStatusRes = http.get(
        `${BASE_URL}/api/events/${eventId}/attendance/user/${TEST_USER_ID}`
      );
      check(userStatusRes, {
        [`GET /api/events/${eventId}/attendance/user/${TEST_USER_ID} 200 or 404`]:
          (r) => r.status === 200 || r.status === 404,
      });
      sleep(0.2);
    }

    // 4️⃣ Optional: simulate posts or notifications if needed
    // let postsRes = http.get(`${BASE_URL}/api/posts/user/${TEST_USER_ID}/subscriptions/latest`);
    // check(postsRes, { "GET posts OK": (r) => r.status === 200 });

    // Pause briefly between dashboard reloads
    sleep(1);
  });
}
