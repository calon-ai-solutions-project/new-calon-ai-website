from PIL import Image
import numpy as np
from scipy import ndimage as ndi
from collections import deque
import math, os

SRC = '/home/claude/repo/project/uploads/pasted-1781763935836-0.png'
OUT = '/home/claude/repo/project/assets/hero-anim.gif'

N_FRAMES = 28
FRAME_DURATION_MS = 150
OUT_W = 380   # output width for web (CSS scales up)

base_img = Image.open(SRC).convert('RGB')
W, H = base_img.size   # 654x642 – detect at full res
base_arr = np.array(base_img).astype(np.float32)

R, G, B = base_arr[...,0], base_arr[...,1], base_arr[...,2]
lum = 0.299*R + 0.587*G + 0.114*B

# Hub centre – most concentrated bright blob
hub_yx = np.unravel_index(ndi.gaussian_filter(lum, sigma=18).argmax(), lum.shape)
hub_y, hub_x = int(hub_yx[0]), int(hub_yx[1])
print(f"Hub centre: ({hub_x}, {hub_y})  image: {W}x{H}")

yy, xx = np.mgrid[:H, :W]
dist_from_hub = np.sqrt((xx-hub_x)**2 + (yy-hub_y)**2)

HUB_R = 44  # pixels to exclude around hub core

# Line pixels: bright, not in hub core, above hub (lines radiate upward),
# exclude the text column on the far left (x < 180) and bottom text area
line_mask = (
    (lum > 45) &
    (dist_from_hub > HUB_R) &
    (dist_from_hub < 310) &
    ~((xx < 175) & (yy < hub_y + 20)) &  # exclude left text
    (yy < hub_y + 15)                      # lines are above hub
)

line_mask = ndi.binary_opening(line_mask, structure=np.ones((2,2)))

labeled, n = ndi.label(line_mask)
sizes = ndi.sum(line_mask, labeled, range(1, n+1))
valid = [i+1 for i, s in enumerate(sizes) if s >= 15]
print(f"Line components: {len(valid)} (sizes: {sorted([int(sizes[v-1]) for v in valid], reverse=True)[:10]})")

def farthest_pt(mask):
    ys, xs = np.where(mask)
    if not len(xs): return None
    dists = (xs-hub_x)**2 + (ys-hub_y)**2
    idx = dists.argmax()
    return int(xs[idx]), int(ys[idx])

def build_phase(mask, ep):
    ex, ey = ep
    if not mask[ey, ex]:
        ys, xs = np.where(mask)
        if not len(xs): return None
        idx = ((xs-ex)**2+(ys-ey)**2).argmin()
        ex, ey = int(xs[idx]), int(ys[idx])
    dist = np.full((H,W), -1, np.int32)
    dist[ey, ex] = 0
    q = deque([(ex,ey)])
    while q:
        x,y = q.popleft(); d=dist[y,x]
        for dx in (-1,0,1):
            for dy in (-1,0,1):
                if dx==0 and dy==0: continue
                nx,ny=x+dx,y+dy
                if 0<=nx<W and 0<=ny<H and mask[ny,nx] and dist[ny,nx]==-1:
                    dist[ny,nx]=d+1; q.append((nx,ny))
    ys,xs=np.where(dist>=0)
    if not len(xs): return None
    d=dist[ys,xs].astype(np.float32)
    dmax=d.max() if d.max()>0 else 1.0
    return ys,xs,d/dmax

lines=[]
for ci in valid:
    m=labeled==ci
    ep=farthest_pt(m)
    if ep:
        r=build_phase(m,ep)
        if r: lines.append(r)
print(f"Lines ready: {len(lines)}")

center_glow = np.exp(-dist_from_hub**2/(2*55**2))

PULSE_HEAD_SIGMA = 0.06
PULSE_TRAIL_LEN  = 0.20
MAX_BOOST        = 260

def pulse_profile(d):
    head  = np.exp(-(d**2)/(2*PULSE_HEAD_SIGMA**2))
    trail = np.where(d<0, np.exp(d/PULSE_TRAIL_LEN), 0.0)*0.55
    return np.maximum(head, trail)

def envelope(t):
    fade=0.10
    if t<fade: x=t/fade; return x*x*(3-2*x)
    if t>1-fade: x=(1-t)/fade; return x*x*(3-2*x)
    return 1.0

def render_frame(idx):
    t=idx/N_FRAMES; env=envelope(t)
    img=base_arr.copy()
    if env>0.001:
        for ys,xs,phase in lines:
            d=t-phase
            intensity=pulse_profile(d)*env*MAX_BOOST
            img[ys,xs,0]+=intensity*0.60
            img[ys,xs,1]+=intensity*0.85
            img[ys,xs,2]+=intensity
    breath=0.5+0.5*math.sin(t*2*math.pi)
    amt=18+28*breath
    img[...,1]+=center_glow*amt*0.62
    img[...,2]+=center_glow*amt
    np.clip(img,0,255,out=img)
    frame=Image.fromarray(img.astype(np.uint8),'RGB')
    # Resize to output width
    ow=OUT_W; oh=int(H*OUT_W/W)
    return frame.resize((ow,oh), Image.LANCZOS)

print(f"Rendering {N_FRAMES} frames (output {OUT_W}x{int(H*OUT_W/W)})...")
frames=[]
for i in range(N_FRAMES):
    if i%10==0: print(f"  {i}/{N_FRAMES}")
    frames.append(render_frame(i))

print("Quantising...")
palette_src=frames[0].quantize(colors=80, method=Image.Quantize.FASTOCTREE)
quantised=[f.quantize(palette=palette_src, dither=Image.Dither.FLOYDSTEINBERG) for f in frames]

print(f"Saving → {OUT}")
quantised[0].save(OUT,save_all=True,append_images=quantised[1:],
                  duration=FRAME_DURATION_MS,loop=0,disposal=2,optimize=True)
print(f"Done. {os.path.getsize(OUT)/1024:.1f} KB  {N_FRAMES}f × {FRAME_DURATION_MS}ms = {N_FRAMES*FRAME_DURATION_MS/1000:.1f}s loop")
