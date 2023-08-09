# MOTORQ AE TASK — Summer Intern '25
## Anirudh Mishra

API Docs: [Postman](https://documenter.getpostman.com/view/19697822/2s9Xy2Nrir)
Live Demo: [YouTube, Part 1](https://youtu.be/MPZqCgrCNbg)
Live Demo: [YouTube, Part 2](https://youtu.be/SXivGtwgO6w) (forgot to show implementation of last few features in first video.)

Features:
- SSE for asynchronicity (currently only implemented for the Admin History as shown in the live demo, working on the same for other routes as well).
- Email notifications.
- Various workflow types, with differing acceptance criterias. Admins can assign approval-users for each workflow, as needed.
- Users are notified if approver wants further justification for a request, and can revert back to them.
- etc.

# Running Locally:
1. Clone the Repo.
2. `cd backend`
3. `cd app`
4. `yarn install`
5. Replace `example.env` in `/backend/app` with `.env` and replace with your mongo connection string and a random JWT secret string.
6. `tsc` to build
7. `npm start`
8. Backend should be up at `http://localhost:3000/` by default.
9. Now, frontend:
10. `cd frontend`
11. `yarn install`
12. `npm run dev`
13. Frontend should be up at `http://localhost:5174/`
