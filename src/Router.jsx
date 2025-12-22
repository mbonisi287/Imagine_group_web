import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import {
  Dashboard,
  Team,
  Invoices,
  Contacts,
  Form,
  Bar,
  Line,
  Pie,
  FAQ,
  Geography,
  Calendar,
  Stream,
  
  TenderProjects,
  TenderFeedback,
  UserAccounts,
  NewTender,
  AllTenderFeedbacks,
  Notifications,
  TenderDocuments,
  SingleProject,
  Leads,
  Prospects,
  Pipeline,
  Assets,
  Mancom,
  Fincom,
  Excom,

} from "./scenes";
import Login  from "./userProfile/login";
import PasswordChange from './userProfile/changePassword';

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/team" element={<Team />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/invoices" element={<Invoices />} />
          <Route path="/form" element={<Form />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/bar" element={<Bar />} />
          <Route path="/pie" element={<Pie />} />
          <Route path="/stream" element={<Stream />} />
          <Route path="/line" element={<Line />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/geography" element={<Geography />} />
         
          <Route path="/tenderProjects" element={<TenderProjects />} />
          <Route path="/tenderFeedback" element={<TenderFeedback />} />
          <Route path="/tenderFeedback/:id" element={<TenderFeedback />} />
          <Route path="/newTender" element={<NewTender />} />
          <Route path="/userAccounts" element={<UserAccounts/>} />
          <Route path="/allTenderFeedbacks" element={<AllTenderFeedbacks />} />
          <Route path="/notifications" element={<Notifications/>} />
          <Route path="/tenderDocuments" element={<TenderDocuments/>} />
          <Route path="/singleProject/:id" element={<SingleProject/>} />
          <Route path="/leads" element={<Leads/>} />
          <Route path="/prospects" element={<Prospects/>} />
          <Route path="/pipeline" element={<Pipeline/>} />
          <Route path="/assets" element={<Assets/>} />
          <Route path="/mancom" element={<Mancom/>} />
          <Route path="/fincom" element={<Fincom/>} />
          <Route path="excom" element={<Excom/>} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
