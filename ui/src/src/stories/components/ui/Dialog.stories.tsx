import React from "react";

import Dialog from "../../../components/ui/Dialog";

export default {
  component: Dialog,
  title: "components/ui/Dialog",
  args: {
    title: "This is a dialog title",
    text: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
            magna aliqua. Enim tortor at auctor urna nunc. Blandit massa enim nec dui nunc mattis enim. Nulla facilisi
            nullam vehicula ipsum a arcu cursus vitae congue. Congue eu consequat ac felis donec et odio. Id volutpat
            lacus laoreet non curabitur gravida. Magna eget est lorem ipsum dolor. Lorem dolor sed viverra ipsum nunc
            aliquet bibendum enim facilisis. Tortor posuere ac ut consequat semper. Nisl suscipit adipiscing bibendum est
            ultricies integer quis. Pellentesque habitant morbi tristique senectus. Et netus et malesuada fames. Euismod
            in pellentesque massa placerat duis ultricies. Odio pellentesque diam volutpat commodo. Dictumst quisque
            sagittis purus sit amet volutpat consequat. Purus viverra accumsan in nisl nisi. Nulla aliquet porttitor lacus
            luctus.`,
  },
  argTypes: { onClose: { action: true } },
};

export const Default = (args: any) => (
  <Dialog open {...args} className="max-w-md w-100">
    <Dialog.Title className="p-5">{args.title}</Dialog.Title>
    <Dialog.Close onClick={args.onClose} />
    <div className="p-5">
      <p>{args.text}</p>
    </div>
  </Dialog>
);

export const WithOKCancelFooter = (args: any) => (
  <Dialog open {...args} className="max-w-md w-100">
    <div className="p-5">
      <p>{args.text}</p>
    </div>
    <Dialog.OKCancelFooter />
  </Dialog>
);

export const LongText = (args: any) => (
  <Dialog open {...args} className="max-w-md">
    <Dialog.Title className="p-5">{args.title}</Dialog.Title>
    <Dialog.Close />
    <div className="p-5">
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
        magna aliqua. Enim tortor at auctor urna nunc. Blandit massa enim nec dui nunc mattis enim. Nulla facilisi
        nullam vehicula ipsum a arcu cursus vitae congue. Congue eu consequat ac felis donec et odio. Id volutpat lacus
        laoreet non curabitur gravida. Magna eget est lorem ipsum dolor. Lorem dolor sed viverra ipsum nunc aliquet
        bibendum enim facilisis. Tortor posuere ac ut consequat semper. Nisl suscipit adipiscing bibendum est ultricies
        integer quis. Pellentesque habitant morbi tristique senectus. Et netus et malesuada fames. Euismod in
        pellentesque massa placerat duis ultricies. Odio pellentesque diam volutpat commodo. Dictumst quisque sagittis
        purus sit amet volutpat consequat. Purus viverra accumsan in nisl nisi. Nulla aliquet porttitor lacus luctus.
      </p>
      <p>
        Non nisi est sit amet facilisis. Vitae auctor eu augue ut. Feugiat pretium nibh ipsum consequat nisl vel.
        Habitasse platea dictumst vestibulum rhoncus. Suspendisse potenti nullam ac tortor vitae. Sed libero enim sed
        faucibus turpis in eu mi. Scelerisque eleifend donec pretium vulputate. Vel pharetra vel turpis nunc eget.
        Sagittis eu volutpat odio facilisis mauris sit amet massa. Rhoncus aenean vel elit scelerisque mauris. Id
        faucibus nisl tincidunt eget. Lobortis feugiat vivamus at augue eget arcu. Ultrices tincidunt arcu non sodales
        neque sodales. Eget egestas purus viverra accumsan in nisl nisi scelerisque. Et netus et malesuada fames ac.
        Turpis massa sed elementum tempus egestas sed. Sed viverra tellus in hac habitasse.
      </p>
      <p>
        Viverra aliquet eget sit amet tellus cras adipiscing enim eu. Lacus vel facilisis volutpat est velit egestas dui
        id ornare. Congue quisque egestas diam in arcu cursus euismod quis. Turpis nunc eget lorem dolor sed viverra
        ipsum nunc aliquet. Sit amet commodo nulla facilisi nullam. At in tellus integer feugiat scelerisque varius
        morbi enim. Mauris augue neque gravida in fermentum et sollicitudin. Volutpat consequat mauris nunc congue nisi
        vitae suscipit tellus. Pretium fusce id velit ut tortor pretium. Posuere lorem ipsum dolor sit amet consectetur
        adipiscing. Ultrices mi tempus imperdiet nulla malesuada pellentesque elit.
      </p>
      <p>
        Leo a diam sollicitudin tempor id eu nisl nunc. Orci sagittis eu volutpat odio. Adipiscing commodo elit at
        imperdiet dui accumsan. Nisi scelerisque eu ultrices vitae auctor eu augue ut. Commodo elit at imperdiet dui
        accumsan sit amet nulla facilisi. Nec nam aliquam sem et tortor consequat id porta nibh. Morbi tristique
        senectus et netus et malesuada. Tincidunt augue interdum velit euismod in. Facilisis magna etiam tempor orci eu
        lobortis. Egestas tellus rutrum tellus pellentesque eu tincidunt tortor aliquam. Nibh sit amet commodo nulla
        facilisi nullam vehicula ipsum a. At consectetur lorem donec massa sapien faucibus et molestie ac. Pretium fusce
        id velit ut tortor pretium viverra suspendisse potenti. Ridiculus mus mauris vitae ultricies leo integer. Ut
        venenatis tellus in metus vulputate eu scelerisque. Amet volutpat consequat mauris nunc congue. Morbi tristique
        senectus et netus et.
      </p>
      <p>
        Diam quam nulla porttitor massa id neque. Tellus orci ac auctor augue mauris augue neque gravida in. Quam
        vulputate dignissim suspendisse in est ante. In cursus turpis massa tincidunt dui ut ornare lectus. Vivamus arcu
        felis bibendum ut tristique et. Ac tortor dignissim convallis aenean et tortor. In dictum non consectetur a erat
        nam at. Ipsum faucibus vitae aliquet nec ullamcorper sit. Ac placerat vestibulum lectus mauris ultrices eros.
        Est sit amet facilisis magna etiam tempor orci eu lobortis. Facilisi cras fermentum odio eu feugiat pretium.
        Maecenas volutpat blandit aliquam etiam erat velit scelerisque in. Convallis a cras semper auctor. Aliquet nec
        ullamcorper sit amet risus nullam eget. Justo laoreet sit amet cursus sit amet dictum sit amet. Vestibulum lorem
        sed risus ultricies tristique nulla aliquet enim. Ut eu sem integer vitae justo. Ac turpis egestas maecenas
        pharetra convallis posuere morbi leo urna. Ullamcorper sit amet risus nullam eget.
      </p>
    </div>
  </Dialog>
);
