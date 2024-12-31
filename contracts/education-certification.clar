;; Storage for certificates
(define-map certificates
  { student: principal, course-id: uint }
  { issuer: principal, issued-date: uint })

;; Storage for scholarships
(define-map scholarships
  { student: principal }
  { amount: uint, eligibility-date: uint })

;; Storage for course payments
(define-map course-payments
  { course-id: uint, student: principal }
  { tutor: principal, amount: uint, is-completed: bool })

;; Events storage using data vars
(define-data-var certificate-events (list 200 {student: principal, course-id: uint, issuer: principal}) (list))
(define-data-var scholarship-events (list 200 {student: principal, amount: uint}) (list))
(define-data-var payment-events (list 200 {student: principal, course-id: uint, tutor: principal, amount: uint}) (list))

;; Helper functions to emit events
(define-public (emit-certificate-event (student principal) (course-id uint) (issuer principal))
  (ok (var-set certificate-events 
    (unwrap! (as-max-len? 
      (concat (var-get certificate-events) 
              (list {student: student, course-id: course-id, issuer: issuer}))
      u200)
      (err u403)))))

(define-public (emit-scholarship-event (student principal) (amount uint))
  (ok (var-set scholarship-events 
    (unwrap! (as-max-len? 
      (concat (var-get scholarship-events) 
              (list {student: student, amount: amount}))
      u200)
      (err u403)))))

(define-public (emit-payment-event (student principal) (course-id uint) (tutor principal) (amount uint))
  (ok (var-set payment-events 
    (unwrap! (as-max-len? 
      (concat (var-get payment-events) 
              (list {student: student, course-id: course-id, tutor: tutor, amount: amount}))
      u200)
      (err u403)))))

;; CERTIFICATION VERIFICATION MODULE
(define-public (issue-certificate (student principal) (course-id uint) (issued-date uint))
  (begin
    (asserts! (is-none (map-get? certificates { student: student, course-id: course-id }))
              (err u100)) ;; Certificate already exists
    (ok (map-set certificates 
         { student: student, course-id: course-id } 
         { issuer: tx-sender, issued-date: issued-date }))))

(define-public (verify-certificate (student principal) (course-id uint))
  (match (map-get? certificates { student: student, course-id: course-id })
    certificate (ok certificate)
    (err u101))) ;; Certificate not found

;; DECENTRALIZED LEARNING PLATFORM MODULE
(define-public (register-course-payment (course-id uint) (tutor principal) (amount uint))
  (begin
    (asserts! (> amount u0) (err u200)) ;; Amount must be greater than 0
    (ok (map-set course-payments 
         { course-id: course-id, student: tx-sender } 
         { tutor: tutor, amount: amount, is-completed: false }))))

(define-public (mark-course-complete (course-id uint) (student principal))
  (let (
    (payment-data (unwrap! (map-get? course-payments { course-id: course-id, student: student })
                          (err u404))) ;; Payment not found
    )
    (begin
      (asserts! (is-eq (get tutor payment-data) tx-sender) 
                (err u201)) ;; Only tutor can mark completion
      (asserts! (not (get is-completed payment-data)) 
                (err u202)) ;; Already completed
      (try! (stx-transfer? (get amount payment-data) tx-sender student))
      (try! (emit-payment-event student course-id tx-sender (get amount payment-data)))
      (ok (map-set course-payments 
           { course-id: course-id, student: student } 
           (merge payment-data { is-completed: true }))))))

;; SCHOLARSHIP MANAGEMENT MODULE
(define-public (grant-scholarship (student principal) (amount uint) (eligibility-date uint))
  (begin
    (asserts! (> amount u0) (err u300)) ;; Amount must be greater than 0
    (try! (emit-scholarship-event student amount))
    (ok (map-set scholarships 
         { student: student } 
         { amount: amount, eligibility-date: eligibility-date }))))

(define-public (claim-scholarship)
  (let (
    (scholarship-data (unwrap! (map-get? scholarships { student: tx-sender })
                              (err u404))) ;; Scholarship not found
    )
    (begin
      (asserts! (<= (get eligibility-date scholarship-data) burn-block-height) 
                (err u301)) ;; Eligibility criteria not met
      (try! (stx-transfer? (get amount scholarship-data) tx-sender tx-sender))
      (ok (map-delete scholarships { student: tx-sender })))))

;; Read only functions to get events
(define-read-only (get-certificate-events)
  (ok (var-get certificate-events)))

(define-read-only (get-scholarship-events)
  (ok (var-get scholarship-events)))

(define-read-only (get-payment-events)
  (ok (var-get payment-events)))