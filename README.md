# 🧪 NGN Lab Web Server 운영 기록 (Raspberry Pi)

## 1. 서버 개요

* **용도**: 연구실 홈페이지(정적 웹사이트)
* **서버 장비**: Raspberry Pi
* **OS**: Ubuntu Server 22.04 LTS (ARM64)
* **웹 서버**: Nginx
* **배포 방식**: GitHub → 서버에서 직접 clone
* **외부 공개 여부**: 내부망 공개 완료 / 외부 공개 예정

---

## 2. 서버 접속 정보

* **내부 IP**: `XXX.XXX.XXX.XXX`
* **SSH 사용자**: `ngn`
* **접속 방식**:

```bash
ssh ngn@<서버_IP>
```

> ⚠️ SSH는 키 로그인만 허용됨 (비밀번호 로그인 비활성화)

---

## 3. 디렉토리 구조

```text
/srv/ngnlab
├── css/
├── js/
├── img/
├── video/
└── view/
    └── index.html
```

* `index.html` 위치: `/srv/ngnlab/view/index.html`
* CSS/JS/img/video는 상위 디렉토리에 존재

---

## 4. Nginx 설정

### 설정 파일 위치

```
/etc/nginx/sites-available/ngnlab
```

### Nginx 설정 내용

```nginx
server {
    listen 80;
    server_name _;

    root /srv/ngnlab/view;
    index index.html;

    location /css/   { alias /srv/ngnlab/css/; }
    location /js/    { alias /srv/ngnlab/js/; }
    location /img/   { alias /srv/ngnlab/img/; }
    location /video/ { alias /srv/ngnlab/video/; }

    location / {
        try_files $uri $uri/ =404;
    }
}
```

### 활성화 명령어

```bash
sudo ln -sf /etc/nginx/sites-available/ngnlab /etc/nginx/sites-enabled/ngnlab
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

---

## 5. 코드 배포 방법 (업데이트 시)

```bash
cd /srv/ngnlab
git pull
sudo systemctl reload nginx
```

---

## 6. 서버 재부팅 후 점검

```bash
sudo reboot
```

재부팅 후 확인:

* `http://<서버_IP>` 접속 가능
* CSS / JS 정상 로딩