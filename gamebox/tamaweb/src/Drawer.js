class Drawer {
    UNCLEANED_REMOVED_OBJECTS_THRESHOLD = 64;

    uncleanedRemovedObjects = 0;
    constructor(canvas, optWidth, optHeight) {
        if (!canvas) {
            canvas = document.createElement("canvas");
            canvas.setAttribute("width", optWidth);
            canvas.setAttribute("height", optHeight);
        }
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.context.fillStyle = "white";
        this.context.font = "8px Calibri";

        this.context.msImageSmoothingEnabled = false;
        this.context.mozImageSmoothingEnabled = false;
        this.context.webkitImageSmoothingEnabled = false;
        this.context.imageSmoothingEnabled = false;
        // this.bounds = canvas.getBoundingClientRect();
        this.bounds = {
            width: optWidth || this.canvas.width,
            height: optHeight || this.canvas.height,
        };
        this.objects = [];
        this.cameraPosition = {
            x: 0,
            y: 0,
            z: 0,
        };
    }
    draw(objects = this.objects, skipClear) {
        if (!skipClear) this.clear();

        this.context.save();

        if (
            this.uncleanedRemovedObjects >
            this.UNCLEANED_REMOVED_OBJECTS_THRESHOLD
        ) {
            this.cleanupObjectsArray();
        }

        if (this.cameraPosition.z !== 0) {
            const canvasCenterX = this.canvas.width / 2;
            const canvasCenterY = this.canvas.height / 2;

            let zoomFactor;
            if (this.cameraPosition.z > 0) {
                zoomFactor = 1 + this.cameraPosition.z;
            } else {
                zoomFactor = 1 / (1 - this.cameraPosition.z);
            }

            this.context.translate(canvasCenterX, canvasCenterY);
            this.context.scale(zoomFactor, zoomFactor);
            this.context.translate(-canvasCenterX, -canvasCenterY);
        }

        // sorting based on z
        objects = objects
            .filter(Boolean)
            .sort(this.compareRenderOrder);

        objects.forEach((object) => {
            if (!object || object.hidden || object.absHidden) return;

            object.onDraw?.(object);

            if (object.invisible) return;

            // check for currently hovered over object
            if (App.mouse.isInBounds && (object?.onHover || object?.onClick)) {
                object.isHovered = false;
                const box = object?.getBoundingBox?.();
                if (
                    box &&
                    Object2d.checkAabbCollision(
                        { x: App.mouse.x, y: App.mouse.y, width: 1, height: 1 },
                        box,
                    )
                ) {
                    object.onHover?.(object);
                    object.isHovered = true;
                    if (App.mouse.isDown) {
                        object.onClick?.(object);
                    }
                }
            }

            if (object.x?.toString().indexOf("%") >= 0) {
                let width = object.spritesheet
                    ? object.spritesheet.cellSize
                    : object.width || object.image.width;
                object.x =
                    this.getRelativePositionX(
                        Number(
                            object.x
                                .toString()
                                .slice(0, object.x.toString().length - 1),
                        ),
                    ) -
                    width / 2;
            }
            if (object.y?.toString().indexOf("%") >= 0) {
                let height = object.spritesheet
                    ? object.spritesheet.cellSize
                    : object.height || object.image.height;
                object.y =
                    this.getRelativePositionY(
                        Number(object.y.slice(0, object.y.length - 1)),
                    ) -
                    height / 2;
            }

            let x = object.x + (object.static ? 0 : this.cameraPosition.x),
                y = object.y + (object.static ? 0 : this.cameraPosition.y);

            if (object.additionalX) x += object.additionalX;
            if (object.additionalY) y += object.additionalY;

            if (object.positionOffset) {
                x += object.positionOffset.x || 0;
                y += object.positionOffset.y || 0;
            }

            if (object.isRelative) {
                let current = object;
                while (current?.parent) {
                    current = current.parent;
                    x += current.x;
                    y += current.y;
                }
            }

            // fixes blurriness on some frames
            y = Math.round(y);
            x = Math.round(x);

            this.drawSprite(object, x, y);

            if (object.text) {
                this.context.fillText(object.text, x, y);
            }

            object.onLateDraw?.(object);
        });

        this.context.restore();
        return this;
    }
    drawSprite(object, x, y) {
        const {
            image,
            spritesheet,
            solidColor,
            inverted,
            upperHalfOffsetY,
            scale,
            width,
            height,
            clipCircle,
            rotation,
            composite,
            opacity,
            filter,
            clip,
        } = object;
        if (!image?.naturalWidth && !solidColor) return;

        this.context.save();

        const spriteCenterX =
            x +
            (spritesheet
                ? spritesheet.cellSize / 2
                : (width || image.width) / 2);
        const spriteCenterY =
            y +
            (spritesheet
                ? spritesheet.cellSize / 2
                : (height || image.height) / 2);

        if (scale) {
            this.context.translate(spriteCenterX, spriteCenterY);
            this.context.scale(scale, scale);
            this.context.translate(-spriteCenterX, -spriteCenterY);
        }

        if (rotation) {
            const rotationRadians = rotation * (Math.PI / 180);
            this.context.translate(spriteCenterX, spriteCenterY);
            this.context.rotate(rotationRadians);
            this.context.translate(-spriteCenterX, -spriteCenterY);
        }

        if (clipCircle) {
            const radius =
                Math.min(width || image?.width, height || image?.height) / 2; // for a circle, radius is half of the smaller dimension

            this.context.beginPath();
            this.context.arc(
                spriteCenterX,
                spriteCenterY,
                radius,
                0,
                Math.PI * 2,
                false,
            );
            this.context.clip();
        }

        if (clip && clip.length === 4) {
            this.context.beginPath();
            this.context.moveTo(clip[0][0], clip[0][1]);
            for (let i = 1; i < clip.length; i++) {
                this.context.lineTo(clip[i][0], clip[i][1]);
            }
            this.context.closePath();
            this.context.clip();
        }

        if (inverted) {
            this.context.scale(-1, 1);
            x =
                -x -
                (spritesheet ? spritesheet.cellSize : width || image?.width);
        }

        if (composite) {
            this.context.globalCompositeOperation = composite ?? "multiply";
        }

        if (filter) {
            this.context.filter = filter;
        }

        if (opacity !== undefined) {
            this.context.globalAlpha = clamp(opacity, 0, App.INF);
        }

        if (spritesheet) {
            const cellNumber = spritesheet.cellNumber - 1;
            const { cellSize, columns } = spritesheet;
            const sx = (cellNumber % columns) * cellSize;
            const sy = Math.floor(cellNumber / columns) * cellSize;

            const upperHalfHeight = Math.round((4 / 5) * cellSize);
            const lowerHalfHeight = cellSize - upperHalfHeight;

            const drawHalf = (half, offsetY) => {
                let dy = y; // destination y coordinate
                let sh = half === 0 ? upperHalfHeight : lowerHalfHeight; // source height
                let dh = sh; // destination height

                if (half === 0 && offsetY) dy += offsetY; // applying offset to upper half

                this.context.drawImage(
                    image,
                    sx,
                    sy + (half === 0 ? 0 : upperHalfHeight), // adjusting source y for lower half
                    cellSize,
                    sh, // using calculated height for the half
                    x,
                    dy + (half === 0 ? 0 : upperHalfHeight), // adjusting destination y for lower half
                    cellSize,
                    dh, // using calculated height for the half
                );
            };

            drawHalf(0, upperHalfOffsetY); // drawing upper half with offset
            drawHalf(1); // drawing lower half
        } else if (solidColor) {
            const colorString = `rgb(${solidColor.r}, ${solidColor.g}, ${solidColor.b})`;
            this.context.fillStyle = colorString;
            this.context.fillRect(
                x,
                y,
                object.width || image.width,
                object.height || image.height,
            );
        } else {
            this.context.drawImage(
                image,
                x,
                y,
                object.width || image.width,
                object.height || image.height,
            );
        }

        this.context.restore();
    }
    pixelate() {
        let w = this.bounds.width * 0.4,
            h = this.bounds.height * 0.4;
        this.context.drawImage(this.canvas, 0, 0, w, h);
        this.context.drawImage(
            this.canvas,
            0,
            0,
            w,
            h,
            0,
            0,
            this.bounds.width,
            this.bounds.height,
        );
    }
    drawImmediate(entity) {
        if (entity.image) {
            let img = new Image();
            img.src = entity.image;
            entity.image = img;
        }

        this.draw([entity], true);
    }
    clear() {
        this.context.clearRect(0, 0, this.bounds.width, this.bounds.height);
    }
    getRelativePositionX(percent) {
        return (percent / 100) * this.bounds.width;
    }
    getRelativePositionY(percent) {
        return (percent / 100) * this.bounds.height;
    }
    compareRenderOrder(a, b) {
        const aZ = a.z ?? 0;
        const bZ = b.z ?? 0;

        if (aZ !== bZ) {
            return aZ - bZ;
        }

        const aDepth = a.getDepth();
        const bDepth = b.getDepth();

        if (aDepth !== bDepth) {
            return aDepth - bDepth;
        }

        return (a.localZ ?? 0) - (b.localZ ?? 0);
    }
    addObject(object) {
        let id = this.objects.push(object);
        object.drawerId = id - 1;
        return object.drawerId;
    }
    removeObject(object) {
        if (!object || object.drawerId === undefined) {
            return console.log("no drawer id, cant remove", object);
        }

        if(object?.isRemoved) return;

        if (this.objects[object.drawerId] !== object) {
            return console.error('drawerId mismatch', object);
        }

        this.objects[object.drawerId] = null;
        object.isRemoved = true;
        object.onRemove?.(object);

        // fixme: very poor performance over large active objects,
        // every object loops over the entire objects list on removal
        this.objects.forEach((otherObject) => {
            if (otherObject?.parent?.drawerId === object.drawerId) {
                this.removeObject(otherObject);
            }
        });

        this.uncleanedRemovedObjects += 1;
    }
    cleanupObjectsArray() {
        this.objects = this.objects.filter(Boolean);
        this.objects.forEach((object, index) => {
            object.drawerId = index;
        });
        this.uncleanedRemovedObjects = 0;
    }
    setCameraPosition(x, y, lerpSpeed) {
        const targetX = x ?? this.cameraPosition.x,
            targetY = y ?? this.cameraPosition.y;

        if (lerpSpeed) {
            this.setCameraPosition(
                lerp(this.cameraPosition.x, targetX, lerpSpeed),
                lerp(this.cameraPosition.y, targetY, lerpSpeed),
            );
            return;
        }
        this.cameraPosition.x = targetX;
        this.cameraPosition.y = targetY;
    }
    selectObjects(selector) {
        if (Array.isArray(selector)) {
            const results = selector.map((group) => this.selectObjects(group));
            return results.flat();
        }
        return this.objects.filter((object) => object?.selector === selector);
    }
}
