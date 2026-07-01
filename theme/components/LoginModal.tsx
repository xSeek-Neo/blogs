import { useEffect, useId, useRef, useState, type FormEvent } from 'react'

import { getDefaultUsername, verifyCredentials } from '../utils/auth'
import styles from './LoginModal.module.css'

interface LoginModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function LoginModal({ open, onClose, onSuccess }: LoginModalProps) {
  const titleId = useId()
  const passwordRef = useRef<HTMLInputElement>(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) {
      return
    }

    setPassword('')
    setError('')
    passwordRef.current?.focus()
  }, [open])

  useEffect(() => {
    if (!open) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) {
    return null
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!verifyCredentials(getDefaultUsername(), password)) {
      setError('密码错误，请重试')
      return
    }

    onSuccess()
  }

  return (
    <div className={styles.overlay} onClick={onClose} role='presentation'>
      <div
        className={styles.modal}
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className={styles.title} id={titleId}>
          访问验证
        </h2>
        <p className={styles.hint}>请输入密码后继续浏览笔记内容。</p>
        <form onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor='login-username'>
              账户
            </label>
            <input
              id='login-username'
              className={`${styles.input} ${styles.inputReadonly}`}
              type='text'
              name='username'
              value={getDefaultUsername()}
              readOnly
              autoComplete='username'
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label} htmlFor='login-password'>
              密码
            </label>
            <input
              ref={passwordRef}
              id='login-password'
              className={styles.input}
              type='password'
              name='password'
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                setError('')
              }}
              autoComplete='current-password'
              placeholder='请输入密码'
            />
          </div>
          {error ? <p className={styles.error}>{error}</p> : null}
          <div className={styles.actions}>
            <button className={styles.cancel} type='button' onClick={onClose}>
              取消
            </button>
            <button className={styles.submit} type='submit'>
              进入
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
