INPUT := keith-maxwell-head-shot-original.jpg
HEAD := $(subst -original.jpg,,$(INPUT))-
OUTPUT := \
	$(HEAD)256w.webp \
	$(HEAD)500w.jpg \
	$(HEAD)400w.jpg \
	$(HEAD)200w.jpg \
	$(HEAD)128w.jpg
MAGICK := magick $(INPUT) -extent 4016x4016+0+380 -quality 90 -strip

.PHONY: clean

all: $(OUTPUT)

clean:
	rm -f $(OUTPUT)

%.webp:
	$(MAGICK) -resize $(subst $(HEAD),,$(patsubst %w.webp,%,$@)) $@

%.jpg:
	$(MAGICK) -resize $(subst $(HEAD),,$(patsubst %w.jpg,%,$@)) $@
