import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

export default function ProductStatusBadge({ status }) {
  if (status === 'Pending Approval') {
    return (
      <span className="badge badge-amber d-inline-flex align-items-center gap-1 font-weight-bold">
        <Clock size={13} /> Pending Approval
      </span>
    );
  }

  if (status === 'Approved' || status === 'Active') {
    return (
      <span className="badge badge-secondary d-inline-flex align-items-center gap-1 font-weight-bold">
        <CheckCircle size={13} /> Approved & Active
      </span>
    );
  }

  if (status === 'Rejected' || status === 'Cancelled') {
    return (
      <span className="badge badge-rose d-inline-flex align-items-center gap-1 font-weight-bold">
        <XCircle size={13} /> Rejected
      </span>
    );
  }

  if (status === 'Sold') {
    return (
      <span className="badge badge-slate d-inline-flex align-items-center gap-1 font-weight-bold">
        Sold Out
      </span>
    );
  }

  return <span className="badge badge-slate">{status}</span>;
}
