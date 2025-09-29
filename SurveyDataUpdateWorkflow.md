# Survey Data Update Workflow

## Prerequisites
- Ensure access to both repositories: frontend (moral-survey) and backend (moral-back-end).
- Confirm you can reach the MongoDB instance defined by DATABASE_URL in the backend .env files.
- Install required tooling: node, npm, mongosh, and any deployment CLI you normally use.

## Step 1: Identify the Target Study
1. Open the survey page and note the studyId query parameter (for example, ...?studyId=2).
2. Each studyId maps to one document in the posts collection; this value is also used to select unshared questions (see src/service/survey.service.ts).

## Step 2: Review Existing Question Data
1. Connect to MongoDB: mongosh "<DATABASE_URL>".
2. Switch to the survey database: use survey.
3. Inspect the current question document: db.posts.find({ _id: "current_id" }).pretty().
4. Export or snapshot the document before editing so that you can revert if needed.

## Step 3: Update or Insert Question Documents
1. Each question document must include:
   - _id, title, selftext
   - very_certain_YA, very_certain_NA, YA_percentage, NA_percentage (store as 0-1 decimals)
   - original_post_YA_top_reasonings, original_post_NA_top_reasonings (string arrays)
   - count (object keyed by study ID or an array with the same length)
2. Use updateOne or insertOne to change the document. Example:
   ```js
   db.posts.updateOne(
     { _id: "aita_001" },
     {
       $set: {
         title: "New title",
         selftext: "Full scenario text...",
         very_certain_YA: 0.42,
         very_certain_NA: 0.31,
         YA_percentage: 0.58,
         NA_percentage: 0.42,
         original_post_YA_top_reasonings: ["Reason A", "Reason B"],
         original_post_NA_top_reasonings: ["Reason C", "Reason D"],
         count: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 }
       }
     },
     { upsert: true }
   );
   ```
3. Keep count[studyId] aligned with the available study IDs to avoid the studyId out of range error raised by the backend.

## Step 4: Maintain Static Frontend Content
1. Edit training examples, attention checks, and Likert questions in src/js/litw/litw.data.2.0.0.js.
2. Update text templates under src/templates/ and translations in src/moral-survey-1/i18n/*.json if wording changes.
3. Rebuild the bundle from src/moral-survey-1: npx webpack --config webpack.config.js --mode production.

## Step 5: Restart Backend Services
1. Restart the NestJS server so it reloads configuration and clears any in-memory caches.
2. If you changed environment variables, rebuild Docker images or restart PM2/systemd services as appropriate.

## Step 6: Validate End-to-End
1. Call the backend API directly: GET /survey/question?studyId=<id> should return your updated document.
2. Visit the survey page (for example, http://localhost:8080/moral-survey-1/index.html?studyId=<id>) and confirm the new content renders.
3. Complete a survey submission; check db.answer.find().sort({ _id: -1 }).limit(1) to ensure answers are stored.

## Step 7: Document and Deploy
1. Commit frontend and backend changes with descriptive messages.
2. If you manage migrations, update scripts or documentation so teammates can apply the same data changes.
3. Deploy to staging/production following your standard release checklist, then rerun the validation steps in the live environment.
