import{r as g,j as e,u as D,d as P,f as U,z as y}from"./index-B0kpPew-.js";import{r as L}from"./api-BfbnHw83.js";import{S as A,C as E,a as T}from"./scale-BiaPhihU.js";import{U as $}from"./user-BUATVlGf.js";import{M,P as R}from"./phone-C5CG5h2J.js";import{M as F}from"./map-pin-YB2BWb9l.js";import{F as I}from"./file-text-D0oQrRvO.js";import{C as B}from"./calendar-BtMEP2lN.js";import{C as q}from"./clock-Cs3hQ9kk.js";import{c as G}from"./createLucideIcon-eJDyDMHP.js";import{A as _}from"./ArrowLeft2-BnGcqa3I.js";/**
 * @license lucide-react v0.552.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const O=[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["path",{d:"m15 9-6 6",key:"1uzhvr"}],["path",{d:"m9 9 6 6",key:"z0biqf"}]],W=G("circle-x",O),X=({caseId:f,client:d,court:s,title:N,description:r,status:c,startDate:l,endDate:t,createdAt:j,updatedAt:n})=>{const[x,m]=g.useState(!0);if(g.useEffect(()=>{setTimeout(()=>m(!1),2e3)},[d,s]),!d||!s||x)return e.jsx("div",{className:"flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800",children:e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:"inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mb-4"}),e.jsx("p",{className:"text-slate-600 dark:text-slate-300 text-lg",children:"Loading case details..."})]})});const{address:b,clientId:p,clientImage:i,clientName:v,complaint:h,createdAt:u,email:S,phoneNumber:z,status:k}=d,w=a=>{switch(a==null?void 0:a.toLowerCase()){case"active":case"open":return"bg-emerald-100 text-emerald-700 border-emerald-200";case"pending":return"bg-amber-100 text-amber-700 border-amber-200";case"closed":case"resolved":return"bg-blue-100 text-blue-700 border-blue-200";default:return"bg-slate-100 text-slate-700 border-slate-200"}},C=a=>{switch(a==null?void 0:a.toLowerCase()){case"active":case"open":return e.jsx(T,{className:"w-4 h-4"});case"pending":return e.jsx(E,{className:"w-4 h-4"});case"closed":case"resolved":return e.jsx(W,{className:"w-4 h-4"});default:return e.jsx(I,{className:"w-4 h-4"})}},o=a=>a?new Date(a).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}):"N/A";return e.jsx("div",{className:"min-h-screen mt-10 bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-8 px-4",children:e.jsxs("div",{className:"max-w-7xl mx-auto",children:[e.jsxs("div",{className:"bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8 mb-6",children:[e.jsxs("div",{className:"flex items-start justify-between mb-6",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center gap-3 mb-2",children:[e.jsx(A,{className:"w-8 h-8 text-blue-600 dark:text-blue-400"}),e.jsx("h1",{className:"text-3xl font-bold text-slate-800 dark:text-slate-100",children:"Case Details"})]}),e.jsxs("p",{className:"text-slate-500 dark:text-slate-400 text-sm",children:["Case ID: #",f]})]}),e.jsxs("div",{className:`flex items-center gap-2 px-4 py-2 rounded-full border ${w(c)}`,children:[C(c),e.jsx("span",{className:"font-semibold text-sm uppercase tracking-wide",children:c||"Unknown"})]})]}),e.jsxs("div",{className:"border-t border-slate-200 dark:border-slate-700 pt-6",children:[e.jsx("h2",{className:"text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2",children:N||"Untitled Case"}),e.jsx("p",{className:"text-slate-600 dark:text-slate-300 leading-relaxed",children:r||"No description provided"})]})]}),e.jsxs("div",{className:"grid grid-cols-1 lg:grid-cols-3 gap-6",children:[e.jsxs("div",{className:"lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-8",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-6",children:[e.jsx($,{className:"w-6 h-6 text-blue-600 dark:text-blue-400"}),e.jsx("h3",{className:"text-xl font-bold text-slate-800 dark:text-slate-100",children:"Client Information"})]}),e.jsxs("div",{className:"flex items-start gap-6 mb-8",children:[i?e.jsx("img",{src:`http://localhost:8080/api/v1/files/preview-file?fileName=${i}`,alt:i,className:"w-24 h-24 rounded-xl object-cover border-2 border-blue-100 dark:border-blue-900 shadow-md"}):e.jsx("div",{className:"w-24 h-24 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 dark:from-blue-500 dark:to-blue-700 flex items-center justify-center shadow-md",children:e.jsx($,{className:"w-12 h-12 text-white"})}),e.jsxs("div",{className:"flex-1",children:[e.jsx("h4",{className:"text-2xl font-bold text-slate-800 dark:text-slate-100 mb-1",children:v}),e.jsxs("div",{className:`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${w(k)}`,children:[C(k),k||"Unknown"]})]})]}),e.jsxs("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-6",children:[e.jsxs("div",{className:"flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl",children:[e.jsx(M,{className:"w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1",children:"Email"}),e.jsx("p",{className:"text-slate-800 dark:text-slate-200 break-all",children:S||"N/A"})]})]}),e.jsxs("div",{className:"flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl",children:[e.jsx(R,{className:"w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1",children:"Phone"}),e.jsx("p",{className:"text-slate-800 dark:text-slate-200",children:z||"N/A"})]})]}),e.jsxs("div",{className:"flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl md:col-span-2",children:[e.jsx(F,{className:"w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1",children:"Address"}),e.jsx("p",{className:"text-slate-800 dark:text-slate-200",children:b||"N/A"})]})]}),e.jsxs("div",{className:"flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl md:col-span-2",children:[e.jsx(I,{className:"w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1",children:"Complaint"}),e.jsx("p",{className:"text-slate-800 dark:text-slate-200 leading-relaxed",children:h||"No complaint filed"})]})]})]})]}),e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-4",children:[e.jsx(A,{className:"w-6 h-6 text-blue-600 dark:text-blue-400"}),e.jsx("h3",{className:"text-lg font-bold text-slate-800 dark:text-slate-100",children:"Court"})]}),e.jsx("p",{className:"text-slate-800 dark:text-slate-200 font-semibold text-lg",children:s.courtName})]}),e.jsxs("div",{className:"bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-6",children:[e.jsx(B,{className:"w-6 h-6 text-blue-600 dark:text-blue-400"}),e.jsx("h3",{className:"text-lg font-bold text-slate-800 dark:text-slate-100",children:"Timeline"})]}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("div",{className:"w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 mt-2"}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide",children:"Start Date"}),e.jsx("p",{className:"text-slate-800 dark:text-slate-200 font-medium",children:o(l)})]})]}),e.jsxs("div",{className:"flex items-start gap-3",children:[e.jsx("div",{className:"w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400 mt-2"}),e.jsxs("div",{children:[e.jsx("p",{className:"text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide",children:"End Date"}),e.jsx("p",{className:"text-slate-800 dark:text-slate-200 font-medium",children:o(t)})]})]})]})]}),e.jsxs("div",{className:"bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 p-6",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-6",children:[e.jsx(q,{className:"w-6 h-6 text-blue-600 dark:text-blue-400"}),e.jsx("h3",{className:"text-lg font-bold text-slate-800 dark:text-slate-100",children:"Metadata"})]}),e.jsxs("div",{className:"space-y-3 text-sm",children:[e.jsxs("div",{className:"flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-700",children:[e.jsx("span",{className:"text-slate-500 dark:text-slate-400",children:"Case Created"}),e.jsx("span",{className:"text-slate-800 dark:text-slate-200 font-medium",children:o(j)})]}),e.jsxs("div",{className:"flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-700",children:[e.jsx("span",{className:"text-slate-500 dark:text-slate-400",children:"Last Updated"}),e.jsx("span",{className:"text-slate-800 dark:text-slate-200 font-medium",children:o(n)})]}),e.jsxs("div",{className:"flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-700",children:[e.jsx("span",{className:"text-slate-500 dark:text-slate-400",children:"Client Registered"}),e.jsx("span",{className:"text-slate-800 dark:text-slate-200 font-medium",children:o(u)})]}),e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("span",{className:"text-slate-500 dark:text-slate-400",children:"Client ID"}),e.jsxs("span",{className:"text-slate-800 dark:text-slate-200 font-mono font-medium",children:["#",p]})]})]})]})]})]})]})})},le=()=>{const f=D(),{id:d}=P(),[s,N]=g.useState(null);g.useEffect(()=>{if(!d)return;(async()=>{try{const t=await L(`cases/${d}`,"GET",void 0,{Authorization:`Bearer ${localStorage.getItem("token")}`});t!=null&&t.payload&&N(t.payload)}catch(t){console.error("Error fetching case detail:",t)}})()},[d]);const r=l=>l?new Date(l).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}):"N/A",c=()=>{var n,x,m,b,p,i,v,h,u;if(!s){y.error("Case details not loaded yet.");return}const l=(n=s.client)!=null&&n.clientImage?`http://localhost:8080/api/v1/files/preview-file?fileName=${encodeURIComponent(s.client.clientImage)}`:"",t=window.open("","","height=900,width=1200");if(!t){y.error("Pop-up blocked. Please allow pop-ups to print.");return}const j=`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Case Detail Report</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            @page { size: A4; margin: 16mm; }
            body { font-family: Arial, sans-serif; color: #111; }
            .page { width: 100%; }
            h1 { font-size: 22px; margin-bottom: 6px; }
            h2 { font-size: 16px; margin: 18px 0 8px; }
            .meta { font-size: 12px; color: #555; margin-bottom: 12px; }
            .section { border: 1px solid #ddd; border-radius: 8px; padding: 12px; margin-bottom: 10px; }
            .row { display: flex; gap: 16px; margin-bottom: 8px; }
            .col { flex: 1; }
            .label { font-size: 11px; color: #666; text-transform: uppercase; letter-spacing: .04em; margin-bottom: 4px; }
            .value { font-size: 13px; color: #111; }
            .badge { display: inline-block; padding: 4px 8px; border: 1px solid #ddd; border-radius: 999px; font-size: 11px; }
            .footer { font-size: 11px; color: #666; margin-top: 8px; }
            .avoid-break { break-inside: avoid; page-break-inside: avoid; }
            .client-row { display: flex; gap: 16px; align-items: center; margin-bottom: 8px; }
            .client-image { width: 72px; height: 72px; border-radius: 10px; object-fit: cover; border: 1px solid #e5e7eb; }
            .client-image-placeholder { width: 72px; height: 72px; border-radius: 10px; border: 1px dashed #cbd5f5; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="page">
            <div class="section avoid-break">
              <h1>Case Detail Report</h1>
              <div class="meta">
                Case ID: #${s.caseId??"N/A"} | Generated on ${new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"})} at ${new Date().toLocaleTimeString("en-US")}
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">Title</div>
                  <div class="value">${s.title??"N/A"}</div>
                </div>
                <div class="col">
                  <div class="label">Status</div>
                  <div class="value"><span class="badge">${s.status??"N/A"}</span></div>
                </div>
              </div>
              <div class="label">Description</div>
              <div class="value">${s.description??"N/A"}</div>
            </div>

            <div class="section avoid-break">
              <h2>Client Information</h2>
              <div class="client-row">
                ${l?`<img class="client-image" src="${l}" alt="Client" />`:'<div class="client-image-placeholder">No Photo</div>'}
                <div>
                  <div class="label">Client Name</div>
                  <div class="value">${((x=s.client)==null?void 0:x.clientName)??"N/A"}</div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">Client Name</div>
                  <div class="value">${((m=s.client)==null?void 0:m.clientName)??"N/A"}</div>
                </div>
                <div class="col">
                  <div class="label">Client ID</div>
                  <div class="value">#${((b=s.client)==null?void 0:b.clientId)??"N/A"}</div>
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <div class="label">Email</div>
                  <div class="value">${((p=s.client)==null?void 0:p.email)??"N/A"}</div>
                </div>
                <div class="col">
                  <div class="label">Phone</div>
                  <div class="value">${((i=s.client)==null?void 0:i.phoneNumber)??"N/A"}</div>
                </div>
              </div>
              <div class="label">Address</div>
              <div class="value">${((v=s.client)==null?void 0:v.address)??"N/A"}</div>
            </div>

            <div class="section avoid-break">
              <h2>Court & Timeline</h2>
              <div class="row">
                <div class="col">
                  <div class="label">Court Name</div>
                  <div class="value">${((h=s.court)==null?void 0:h.courtName)??"N/A"}</div>
                </div>
                <div class="col">
                  <div class="label">Start Date</div>
                  <div class="value">${r(s.startDate)}</div>
                </div>
                <div class="col">
                  <div class="label">End Date</div>
                  <div class="value">${r(s.endDate)}</div>
                </div>
              </div>
            </div>

            <div class="section avoid-break">
              <h2>Metadata</h2>
              <div class="row">
                <div class="col">
                  <div class="label">Created At</div>
                  <div class="value">${r(s.createdAt)}</div>
                </div>
                <div class="col">
                  <div class="label">Updated At</div>
                  <div class="value">${r(s.updatedAt)}</div>
                </div>
                <div class="col">
                  <div class="label">Client Registered</div>
                  <div class="value">${r((u=s.client)==null?void 0:u.createdAt)}</div>
                </div>
              </div>
            </div>

            <div class="footer">
              This report is generated automatically. For assistance, please contact support.
            </div>
          </div>
        </body>
      </html>
    `;t.document.open(),t.document.write(j),t.document.close(),t.focus(),setTimeout(()=>{t.print(),t.close()},250)};return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"flex items-center gap-3",children:[e.jsx("button",{className:`border border-slate-300 dark:border-slate-700 text-lg flex items-center gap-2 rounded-full
               px-4 py-2 w-auto bg-white/80 dark:bg-slate-800
               text-slate-900 dark:text-slate-100
               hover:bg-slate-100 dark:hover:bg-slate-700 
               transition-colors duration-300 ease-in-out`,onClick:()=>f("/list-case"),children:e.jsx(_,{size:"24",color:"currentColor"})}),e.jsxs("button",{className:`border border-slate-300 dark:border-slate-700 text-lg flex items-center gap-2 rounded-full
               px-4 py-2 w-auto bg-white/80 dark:bg-slate-800
               text-slate-900 dark:text-slate-100
               hover:bg-slate-100 dark:hover:bg-slate-700 
               transition-colors duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed`,onClick:c,disabled:!s,children:[e.jsx(U,{className:"w-4 h-4"}),"Print PDF"]})]}),e.jsx(X,{caseId:(s==null?void 0:s.caseId)??null,client:s==null?void 0:s.client,court:s==null?void 0:s.court,title:s==null?void 0:s.title,description:s==null?void 0:s.description,status:s==null?void 0:s.status,startDate:s==null?void 0:s.startDate,endDate:s==null?void 0:s.endDate,createdAt:s==null?void 0:s.createdAt,updatedAt:s==null?void 0:s.updatedAt})]})};export{le as default};
