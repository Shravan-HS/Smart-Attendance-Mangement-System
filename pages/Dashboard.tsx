import React, { useState, useEffect } from 'react';
import { User, AttendanceRecord, AttendanceStatus } from '../types';
import { getAttendanceRecords, addAttendanceRecord, deleteAttendanceRecord } from '../services/storage';
import { analyzeAttendance } from '../services/gemini';
import { PlusCircle, Trash2, Calendar, User as UserIcon, Loader2, Sparkles, BarChart3 } from 'lucide-react';

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [studentName, setStudentName] = useState('');
  const [status, setStatus] = useState<AttendanceStatus>('Present');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    setRecords(getAttendanceRecords().sort((a, b) => b.timestamp - a.timestamp));
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;

    const newRecord = addAttendanceRecord({
      studentName,
      date,
      status
    });

    setRecords([newRecord, ...records]);
    setStudentName('');
  };

  const handleDelete = (id: string) => {
    deleteAttendanceRecord(id);
    setRecords(records.filter(r => r.id !== id));
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    const result = await analyzeAttendance(records);
    setAnalysis(result);
    setAnalyzing(false);
  };

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        
        {/* Input Section */}
        <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6 mb-8">
          <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4 flex items-center">
            <PlusCircle className="h-5 w-5 mr-2 text-indigo-500" />
            Mark Attendance
          </h2>
          <form onSubmit={handleAdd} className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="student_name" className="block text-sm font-medium text-gray-700">Student Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="student_name"
                  id="student_name"
                  required
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 border"
                  placeholder="Jane Doe"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
              </div>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
              <div className="mt-1">
                <select
                  id="status"
                  name="status"
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as AttendanceStatus)}
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
              <div className="mt-1">
                <input
                  type="date"
                  name="date"
                  id="date"
                  required
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
            </div>

            <div className="sm:col-span-1 flex items-end">
              <button
                type="submit"
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Add
              </button>
            </div>
          </form>
        </div>

        {/* AI Insight Section */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg shadow px-5 py-6 sm:px-6 mb-8 border border-indigo-100">
           <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium leading-6 text-indigo-900 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-indigo-500" />
                AI Attendance Insights
              </h2>
              <button
                onClick={handleAnalyze}
                disabled={analyzing || records.length === 0}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {analyzing ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <BarChart3 className="h-4 w-4 mr-2" />}
                {analyzing ? 'Analyzing...' : 'Generate Report'}
              </button>
           </div>
           
           {analysis && (
             <div className="bg-white p-4 rounded-md border border-indigo-100 text-gray-700 text-sm whitespace-pre-wrap leading-relaxed shadow-sm">
               {analysis}
             </div>
           )}
           {!analysis && !analyzing && (
             <p className="text-sm text-gray-500 italic">Click generate to see trends and potential attendance issues.</p>
           )}
        </div>

        {/* List Section */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
             <li className="bg-gray-50 px-4 py-3 sm:px-6 grid grid-cols-4 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <div>Student</div>
                <div>Status</div>
                <div>Date</div>
                <div className="text-right">Actions</div>
             </li>
            {records.length > 0 ? (
              records.map((record) => (
                <li key={record.id} className="hover:bg-gray-50 transition-colors">
                  <div className="px-4 py-4 sm:px-6 grid grid-cols-4 gap-4 items-center">
                    <div className="text-sm font-medium text-indigo-600 truncate">{record.studentName}</div>
                    <div className="text-sm text-gray-900">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        record.status === 'Present' ? 'bg-green-100 text-green-800' :
                        record.status === 'Absent' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {record.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      {record.date}
                    </div>
                    <div className="text-right">
                      <button 
                        onClick={() => handleDelete(record.id)}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </button>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-8 text-center text-gray-500 text-sm">
                No attendance records found. Add one above!
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};