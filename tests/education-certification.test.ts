import { describe, expect, it, beforeEach } from "vitest";

// Mock State Variables
let certificates: Map<string, { issuer: string; issuedDate: number }>;
let scholarships: Map<string, { amount: number; eligibilityDate: number }>;
let coursePayments: Map<string, { tutor: string; amount: number; isCompleted: boolean }>;
let certificateEvents: Array<{ student: string; courseId: number; issuer: string }>;
let scholarshipEvents: Array<{ student: string; amount: number }>;
let paymentEvents: Array<{ student: string; courseId: number; tutor: string; amount: number }>;

// Reset state before each test
beforeEach(() => {
  certificates = new Map();
  scholarships = new Map();
  coursePayments = new Map();
  certificateEvents = [];
  scholarshipEvents = [];
  paymentEvents = [];
});

// Mock Functions
const issueCertificate = (student: string, courseId: number, issuer: string, issuedDate: number) => {
  const key = `${student}-${courseId}`;
  if (certificates.has(key)) {
    return { err: "Certificate already exists" };
  }
  certificates.set(key, { issuer, issuedDate });
  return { ok: { message: "Certificate issued successfully" } };
};

const verifyCertificate = (student: string, courseId: number) => {
  const key = `${student}-${courseId}`;
  const certificate = certificates.get(key);
  return certificate ? { ok: certificate } : { err: "Certificate not found" };
};

const grantScholarship = (student: string, amount: number, eligibilityDate: number) => {
  if (amount <= 0) {
    return { err: "Amount must be greater than 0" };
  }
  scholarships.set(student, { amount, eligibilityDate });
  scholarshipEvents.push({ student, amount });
  return { ok: { message: "Scholarship granted successfully" } };
};

const claimScholarship = (student: string, currentBlockHeight: number) => {
  const scholarship = scholarships.get(student);
  if (!scholarship) {
    return { err: "Scholarship not found" };
  }
  if (scholarship.eligibilityDate > currentBlockHeight) {
    return { err: "Eligibility criteria not met" };
  }
  scholarships.delete(student);
  return { ok: { message: "Scholarship claimed successfully" } };
};

const registerCoursePayment = (courseId: number, student: string, tutor: string, amount: number) => {
  if (amount <= 0) {
    return { err: "Amount must be greater than 0" };
  }
  const key = `${student}-${courseId}`;
  coursePayments.set(key, { tutor, amount, isCompleted: false });
  return { ok: { message: "Course payment registered successfully" } };
};

const markCourseComplete = (courseId: number, student: string, tutor: string) => {
  const key = `${student}-${courseId}`;
  const payment = coursePayments.get(key);
  if (!payment) {
    return { err: "Payment not found" };
  }
  if (payment.isCompleted) {
    return { err: "Course already completed" };
  }
  if (payment.tutor !== tutor) {
    return { err: "Only the assigned tutor can mark completion" };
  }
  payment.isCompleted = true;
  paymentEvents.push({ student, courseId, tutor, amount: payment.amount });
  return { ok: { message: "Course marked as completed" } };
};

// Tests
describe("Education Certification Tests (Vitest)", () => {
  it("should issue a certificate successfully", () => {
    const result = issueCertificate("student1", 101, "issuer1", 1672531200);
    expect(result).toEqual({ ok: { message: "Certificate issued successfully" } });
    expect(certificates.get("student1-101")).toEqual({ issuer: "issuer1", issuedDate: 1672531200 });
  });

  it("should not issue duplicate certificates", () => {
    issueCertificate("student1", 101, "issuer1", 1672531200);
    const result = issueCertificate("student1", 101, "issuer1", 1672531200);
    expect(result).toEqual({ err: "Certificate already exists" });
  });

  it("should verify an issued certificate", () => {
    issueCertificate("student1", 101, "issuer1", 1672531200);
    const result = verifyCertificate("student1", 101);
    expect(result).toEqual({ ok: { issuer: "issuer1", issuedDate: 1672531200 } });
  });

  it("should return error for non-existent certificate", () => {
    const result = verifyCertificate("student2", 102);
    expect(result).toEqual({ err: "Certificate not found" });
  });

  it("should grant a scholarship successfully", () => {
    const result = grantScholarship("student1", 5000, 2000);
    expect(result).toEqual({ ok: { message: "Scholarship granted successfully" } });
    expect(scholarships.get("student1")).toEqual({ amount: 5000, eligibilityDate: 2000 });
  });

  it("should not grant a scholarship with invalid amount", () => {
    const result = grantScholarship("student1", 0, 2000);
    expect(result).toEqual({ err: "Amount must be greater than 0" });
  });

  it("should claim a scholarship successfully", () => {
    grantScholarship("student1", 5000, 2000);
    const result = claimScholarship("student1", 2000);
    expect(result).toEqual({ ok: { message: "Scholarship claimed successfully" } });
    expect(scholarships.has("student1")).toBe(false);
  });

  it("should register a course payment successfully", () => {
    const result = registerCoursePayment(101, "student1", "tutor1", 1000);
    expect(result).toEqual({ ok: { message: "Course payment registered successfully" } });
    expect(coursePayments.get("student1-101")).toEqual({ tutor: "tutor1", amount: 1000, isCompleted: false });
  });

  it("should mark a course as completed successfully", () => {
    registerCoursePayment(101, "student1", "tutor1", 1000);
    const result = markCourseComplete(101, "student1", "tutor1");
    expect(result).toEqual({ ok: { message: "Course marked as completed" } });
    expect(coursePayments.get("student1-101")?.isCompleted).toBe(true);
  });

  it("should not mark a course as completed by unauthorized tutor", () => {
    registerCoursePayment(101, "student1", "tutor1", 1000);
    const result = markCourseComplete(101, "student1", "tutor2");
    expect(result).toEqual({ err: "Only the assigned tutor can mark completion" });
  });

  it("should not mark a course as completed twice", () => {
    registerCoursePayment(101, "student1", "tutor1", 1000);
    markCourseComplete(101, "student1", "tutor1");
    const result = markCourseComplete(101, "student1", "tutor1");
    expect(result).toEqual({ err: "Course already completed" });
  });
});
